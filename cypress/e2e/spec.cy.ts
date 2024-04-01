
before(() => {
    cy.setCookie("next-auth.session-token", Cypress.env('TESTING_CYPRESS_TOKEN'))
})

describe('as a new user', () => {
    const testname = `test kanban name ${Cypress._.random(0, 1e6)}`

    it('create a new kanban board and verify everything is there', () => {
        cy.visit(Cypress.env('URL') + "select-board")
        cy.get("#createNewKanbanBtn").click()

        cy.url().should("eq", Cypress.env('URL') + "select-board/new")
        cy.get("#name").type(testname)
        cy.get("#createKanbanBtn").click()

        cy.get("#kanbanTitle").should("have.text", testname)

        // check the kanban table
        cy.get("table").eq(1).within(() => {
            cy.get("thead").within(() => {
                cy.get("tr").within(() => {
                    cy.get("th").should("have.length", 5)
                    cy.get("th").eq(0).should("have.text", "")
                    cy.get("th").eq(1).should("have.text", "To do")
                    cy.get("th").eq(1).find("img").should('have.attr', 'src').should('include', 'delete')
                    cy.get("th").eq(2).should("have.text", "Doing")
                    cy.get("th").eq(1).find("img").should('have.attr', 'src').should('include', 'delete')
                    cy.get("th").eq(3).should("have.text", "Done")
                    cy.get("th").eq(1).find("img").should('have.attr', 'src').should('include', 'delete')
                    cy.get("th").eq(4).should("have.text", "Add new")
                })
            })

            cy.get("tbody").within(() => {
                cy.get("tr").should("have.length", 3)
                cy.get("tr").eq(0).within(() => {
                    cy.get("th").should("have.length", 1)
                    cy.get("th").should("have.text", "Team 1")
                    cy.get("th").find("img").should('have.attr', 'src').should('include', 'delete')

                    cy.get("td").should("have.length", 3)
                    cy.get("td").each((cell) => {
                        cy.wrap(cell).get(".bg-card").should("have.length", 0)
                    })
                })
                cy.get("tr").eq(1).within(() => {
                    cy.get("th").should("have.length", 1)
                    cy.get("th").should("have.text", "Team 2")
                    cy.get("th").find("img").should('have.attr', 'src').should('include', 'delete')

                    cy.get("td").should("have.length", 3)
                    cy.get("td").each((cell) => {
                        cy.wrap(cell).get(".bg-card").should("have.length", 0)
                    })
                })
            })
        })

        // check the card and its contents
        cy.get(".bg-card").should("have.length", 1)

        cy.contains(".bg-card", "Start here")
            .click()

        cy.get("[name^='title']")
            .should("have.value", "Start here")

        cy.get("#cardContents").within(() => {
            cy.get("[role='tablist']").within(() => {
                cy.get("button").should("have.length", 2)
                cy.get("button")
                    .first()
                    .should("have.text", "Base information")
                cy.get("button")
                    .last()
                    .should("have.text", "Github")
            })

            cy.get("[role='tabpanel']").should("have.length", 2)
            cy.get("[role='tabpanel']").eq(0).within(() => {
                cy.get("div").eq(0).within(() => {
                    cy.get("div").should("have.length", 2)
                    cy.get("div").eq(0).within(() => {
                        cy.get("label").should("have.length", 1)
                        cy.get("label").should("have.text", "Short description")

                        cy.get("input").should("have.length", 1)
                        cy.get("input").should("have.value", "Create new cards by clicking New Task above the card")
                    })


                    cy.get("div").eq(1).within(() => {
                        cy.get("label").should("have.length", 1)
                        cy.get("label").should("have.text", "Extended description")

                        cy.get("textarea").should("have.length", 1)
                        cy.get("textarea").should("have.value", "You can create Bug cards by clicking on the down arrow next to New Task\nAlternatively, you can customise the cards as you see fit!")
                    })
                })
            })
        })
        cy.contains("button", "Close").click()

        cy.get("#navSelectBoard").click()
    })
})
