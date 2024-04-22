/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
declare namespace Cypress {
    interface Chainable {
        setCardField(cardNumber: number,
            fieldType: string,
            label: string,
            isRequired: boolean,
            requiredErrorMessage?: string): Chainable<any>;
        checkCardField(label: string,
            hasError: boolean,
            errorMessage?: string): Chainable<any>;
        createKanbanAndNavigate(title: string): Chainable<any>;
        navigateToKanban(title: string): Chainable<any>;
        deleteKanban(title: string, onKanbanBoard?: boolean): Chainable<any>;
    }
}

Cypress.Commands.add('setCardField', (cardNumber: number, fieldType: string, label: string,
    isRequired: boolean, requiredErrorMessage?: string) => {

    cy.get("#divCardContent > form > div[dir='ltr'] > div[data-state='active']")
        .within(() => {
            cy.get(".bg-card").eq(cardNumber).within(() => {
                cy.get("div").eq(1).within(() => {
                    cy.get("button").eq(0).click()
                })
            })
        })
    cy.get("div[data-value='" + fieldType + "']").click()
    cy.get("#divCardContent > form > div[dir='ltr'] > div[data-state='active']")
        .within(() => {
            cy.get(".bg-card").eq(cardNumber).within(() => {
                cy.get("div").eq(1).within(() => {
                    cy.get("button").eq(1).click()
                })
            })
        })
    cy.get("input[name='label']").type(label)
    if (isRequired && fieldType !== "track github branch") {
        cy.get("button[role='switch']").click()
        if (requiredErrorMessage) {
            cy.get("[name='errorMessage']").type(requiredErrorMessage)
        }
    }
})

Cypress.Commands.add('checkCardField', (label: string, hasError: boolean, errorMessage?: string) => {
    cy.get("label").first().should("have.text", label)

    cy.get("label").first().should('satisfy', ($el) => {
        const classList = Array.from($el[0].classList)
        return !hasError || classList.includes('text-destructive')
    })
    if (hasError) {
        cy.get("p").should('satisfy', ($el) => {
            const classList = Array.from($el[0].classList)
            return classList.includes('text-destructive')
        })
    }
})

Cypress.Commands.add('createKanbanAndNavigate', (title: string) => {
    cy.visit(Cypress.env('URL') + "select-board")
    cy.get("#createNewKanbanBtn").click()

    cy.get("#name").type(title)
    cy.get("#createKanbanBtn").click()

    cy.get("#kanbanTitle").should("have.text", title)
})

Cypress.Commands.add('navigateToKanban', (title: string) => {
    cy.visit(Cypress.env('URL') + "select-board")
    cy.contains("a", title).click()

    cy.get("#kanbanTitle").should("have.text", title)
})

Cypress.Commands.add('deleteKanban', (title: string, onKanbanBoard = false) => {
    if (!onKanbanBoard)
        cy.navigateToKanban(title)

    cy.contains("button", "Setting").click()
    cy.contains("button", "Advanced").click()
    cy.contains("button", "Delete kanban board").click()
    cy.visit(Cypress.env('URL') + "select-board")
    cy.contains("a", title).should("not.exist")
})
