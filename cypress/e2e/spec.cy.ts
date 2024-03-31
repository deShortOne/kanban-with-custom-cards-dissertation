
before(() => {
    cy.setCookie("next-auth.session-token", Cypress.env('TESTING_CYPRESS_TOKEN'))
})

describe('template spec', () => {
    const testname = `test kanban name ${Cypress._.random(0, 1e6)}`

    it('passes', () => {
        cy.visit(Cypress.env('URL') + "select-board")
        cy.get("#createNewKanbanBtn").click()

        cy.url().should("eq", Cypress.env('URL') + "select-board/new")
        cy.get("#name").type(testname)
        cy.get("#createKanbanBtn").click()

        cy.get("#kanbanTitle").should("have.text", testname)

        cy.get("#navSelectBoard").click()
    })
})
