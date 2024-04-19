
describe("as a user without a session", () => {
    it("visit any page to then asked to be logged in", () => {
        cy.visit(Cypress.env('URL') + "select-board")
        cy.url().should("eq", Cypress.env('URL') + "api/auth/signin?callbackUrl=%2Fselect-board")

        cy.get("form").should("have.attr", "action", Cypress.env('URL') + "api/auth/signin/github").within(() => {
            cy.get("input[name='callbackUrl']")
                .should("have.attr", "type", "hidden")
                .should("have.value", "/select-board")

            cy.get("button > span").should("have.text", "Sign in with GitHub")
        })
    })
})

describe('as a logged in user', () => {
    beforeEach(() => {
        cy.setCookie("next-auth.session-token", Cypress.env('TESTING_CYPRESS_TOKEN'))
    })

    const testname = `test kanban name ${Cypress._.random(0, 1e6)}`

    it('create a new kanban board and verify everything is there with new test card and everything', () => {
        cy.viewport(1920, 1080)
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
                    cy.get("th").eq(1).find("img").should("have.attr", "src", "/delete.svg")
                    cy.get("th").eq(2).should("have.text", "Doing")
                    cy.get("th").eq(1).find("img").should("have.attr", "src", "/delete.svg")
                    cy.get("th").eq(3).should("have.text", "Done")
                    cy.get("th").eq(1).find("img").should("have.attr", "src", "/delete.svg")
                    cy.get("th").eq(4).should("have.text", "Add new")
                })
            })

            cy.get("tbody").within(() => {
                cy.get("tr").should("have.length", 3)
                cy.get("tr").eq(0).within(() => {
                    cy.get("th").should("have.length", 1)
                    cy.get("th").should("have.text", "Team 1")
                    cy.get("th").find("img").should("have.attr", "src", "/delete.svg")

                    cy.get("td").should("have.length", 3)
                    cy.get("td").each((cell) => {
                        cy.wrap(cell).get(".bg-card").should("have.length", 0)
                    })
                })
                cy.get("tr").eq(1).within(() => {
                    cy.get("th").should("have.length", 1)
                    cy.get("th").should("have.text", "Team 2")
                    cy.get("th").find("img").should("have.attr", "src", "/delete.svg")

                    cy.get("td").should("have.length", 3)
                    cy.get("td").each((cell) => {
                        cy.wrap(cell).get(".bg-card").should("have.length", 0)
                    })
                })
            })
        })

        // check the card and its contents
        cy.get(".bg-card").should("have.length", 1)

        cy.contains(".bg-card", "Start here").click()

        cy.get("[name^='title']").should("have.value", "Start here")

        cy.get("#cardContents").within(() => {
            cy.get("[role='tablist']").within(() => {
                cy.get("button").should("have.length", 2)
                cy.get("button").first().should("have.text", "Base information")
                cy.get("button").last().should("have.text", "Github")
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
        cy.url().should("eq", Cypress.env('URL') + "select-board")

        // edit card
        cy.contains("a", testname).click()
        cy.get("#kanbanTitle").should("have.text", testname)

        cy.get("#btnOpenAllCards").click()
        cy.get("#divAllCardsDisplay").within(() => {
            cy.get("[role='menuitem']").should("have.length", 3)
            cy.get("[role='menuitem']").eq(0).should("have.text", "tasktask") // FIXME
            cy.get("[role='menuitem']").eq(1).should("have.text", "bugbug")
            cy.get("[role='menuitem']").eq(2).should("have.text", "Update cards")

            cy.get("[role='menuitem']").eq(2).click()
        })

        cy.get("#dialogKanbanSettings").within(() => {
            cy.get("[role='tablist']").within(() => {
                cy.get("button").should("have.length", 4)
                cy.contains("button", "Cards")
                    .invoke("attr", "data-state")
                    .should("eq", "active")
            })

            cy.get("#tabSettingCards").within(() => {
                cy.get("[role='radiogroup']").within(() => {
                    cy.get("table").within(() => {
                        cy.get("thead").within(() => {
                            cy.get("tr").within(() => {
                                cy.get("th").should("have.length", 4)
                                cy.get("th").eq(0).should("have.text", "Default")
                                cy.get("th").eq(1).should("have.text", "Name")
                                cy.get("th").eq(2).should("have.text", "Card type")
                                cy.get("th").eq(3).should("have.text", "")
                            })
                        })

                        cy.get("tbody").within(() => {
                            cy.get("tr").should("have.length", 2)
                            cy.get("tr").eq(0).within(() => {
                                cy.get("td").should("have.length", 4)
                                cy.get("td").eq(0).get("button")
                                    .invoke("attr", "data-state")
                                    .should("eq", "checked")
                                cy.get("td").eq(1).should("have.text", "task")
                                cy.get("td").eq(2).should("have.text", "task")
                                cy.get("td").eq(3).find("img").should("have.attr", "src", "/setting.svg")
                            })

                            cy.get("tr").eq(1).within(() => {
                                cy.get("td").should("have.length", 4)
                                cy.get("td").eq(0).get("button")
                                    .invoke("attr", "data-state")
                                    .should("eq", "unchecked")
                                cy.get("td").eq(1).should("have.text", "bug")
                                cy.get("td").eq(2).should("have.text", "bug")
                                cy.get("td").eq(3).find("img").should("have.attr", "src", "/setting.svg")
                            })

                            cy.get("tr").eq(0).get("td").eq(3).click()
                        })
                    })
                })
            })
        })

        cy.url().should("contain", Cypress.env('URL') + "card/")

        cy.get("#asideCardSideBar").within(() => {
            cy.get("li").should("have.length", 9)
            let i = 0
            cy.get("li").eq(i).within(() => {
                cy.get("#cardName").should("have.value", "task")
            })

            i++
            cy.get("li").eq(i).within(() => {
                cy.get("#cardTypeName").should("have.text", "task")
            })

            i += 2
            cy.get("li").eq(i).within(() => {
                cy.get("#cardTabName").should("have.value", "Base information")
            })

            i++
            cy.get("li").eq(i).within(() => {
                cy.get("#btnDecrPosition").should("be.disabled")
                cy.get("#tabPositionNumber").should("have.text", "1")
                cy.get("#btnIncrPosition").should("not.be.disabled")

                cy.get("#btnIncrPosition").click()
                cy.get("#tabPositionNumber").should("have.text", "2")
                cy.get("#btnDecrPosition").should("not.be.disabled")
                cy.get("#btnIncrPosition").should("be.disabled")

                cy.get("#btnDecrPosition").click()
                cy.get("#btnDecrPosition").should("be.disabled")
                cy.get("#tabPositionNumber").should("have.text", "1")
                cy.get("#btnIncrPosition").should("not.be.disabled")
            })

            i++
            cy.get("li").eq(i).within(() => {
                cy.get("#btnDecrRowNumber").should("not.be.disabled")
                cy.get("#cardTabRowNumber").should("have.text", "2")

                cy.get("#btnDecrRowNumber").click()
                cy.get("#cardTabRowNumber").should("have.text", "1")
                cy.get("#btnDecrRowNumber").should("be.disabled")

                cy.get("#btnIncrRowNumber").click()
                cy.get("#btnDecrRowNumber").should("not.be.disabled")
                cy.get("#cardTabRowNumber").should("have.text", "2")
            })

            i++
            cy.get("li").eq(i).within(() => {
                cy.get("#btnDecrColNumber").should("be.disabled")
                cy.get("#cardTabColNumber").should("have.text", "1")

                cy.get("#btnIncrColNumber").click()
                cy.get("#cardTabColNumber").should("have.text", "2")
                cy.get("#btnDecrColNumber").should("not.be.disabled")

                cy.get("#btnDecrColNumber").click()
                cy.get("#btnDecrColNumber").should("be.disabled")
                cy.get("#cardTabColNumber").should("have.text", "1")
            })
        })

        cy.get("#divCardContent").within(() => {
            cy.get("form").within(() => {
                cy.get("div").eq(0).within(() => {
                    cy.get("input").should("be.disabled")
                    cy.get("button").each((elem) => {
                        cy.wrap(elem).should("be.disabled")
                    })
                })

                cy.get("div[dir='ltr']").within(() => {
                    cy.get("[role='tablist']").within(() => {
                        cy.get("button").should("have.length", 2)
                        cy.get("button").eq(0).should("have.text", "Base information")
                        cy.get("button").eq(1).should("have.text", "Github")
                    })

                    cy.get("div[role='tabpanel']").should("have.length", 2)
                    cy.get("div[data-state='active']").within(() => {
                        cy.get(".bg-card").should("have.length", 2)
                        cy.get(".bg-card").eq(0).within(() => {
                            cy.get("div").eq(0).should("have.text", "Short description")
                            cy.get("div").eq(1).within(() => {
                                cy.get("button").should("have.length", 2)
                                cy.get("button").eq(0).should("have.text", "Text field")
                                cy.get("button").eq(1)
                                    .find("img")
                                    .should("have.attr", "src", "/setting.svg")
                            })
                        })

                        cy.get(".bg-card").eq(1).within(() => {
                            cy.get("div").eq(0).should("have.text", "Extended description")
                            cy.get("div").eq(1).within(() => {
                                cy.get("button").should("have.length", 2)
                                cy.get("button").eq(0).should("have.text", "Text area")
                                cy.get("button").eq(1)
                                    .find("img")
                                    .should("have.attr", "src", "/setting.svg")
                            })
                        })
                    })
                })
            })
        })

        cy.get("#cardName").type("{selectall}{backspace}Test")
        cy.get("#cardTypeName").click()
        cy.get("#cardTypeSelectorBox").within(() => {
            cy.get("div[role='group']").within(() => {
                cy.get("div").should("have.length", 5)
                cy.get("div").eq(3).click()
            })
        })
        cy.get("#cardTypeEditModal").within(() => {
            cy.get("div").should("have.length", 4)
            cy.get("div").eq(0).within(() => {
                cy.get("h2").should("have.text", "Edit Card Types")
                cy.get("p").should("have.text", "Add, remove or edit card types")
            })
            cy.get("div").eq(1).get("section").should("have.length", 2)
            cy.get("div").eq(2).within(() => {
                cy.get("button").eq(0).should("have.text", "Add new card type")
                cy.get("button").eq(0).click()
            })
            cy.get("div").should("have.length", 4)
            cy.get("div").eq(1).get("section").should("have.length", 3)
            cy.get("div").eq(1).get("section").eq(2).within(() => {
                cy.get("input").type("CTest")
            })
            cy.get("div").eq(2).within(() => {
                cy.get("button").eq(1).should("have.text", "Save changes")
                cy.get("button").eq(1).click()
            })
        })

        cy.get("#divCardContent").get("div[role='tablist']").within(() => {
            cy.contains("button", "Github").click()
        })
        cy.get("#cardTabName").should("have.value", "Github")
        cy.contains("button", "Remove current tab").click()
        cy.get("#btnDecrPosition").should("be.disabled")
        cy.get("#btnIncrPosition").should("be.disabled")
        cy.contains("button", "Remove current tab").should("be.disabled")
        cy.get("#cardTabName").should("have.value", "Base information")

        cy.get("#cardTabName").type("{selectall}{backspace}Basic")
        cy.get("#btnIncrRowNumber").click()
        cy.get("#btnIncrColNumber").click()

        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(0, "text field", "Single line w/o placeholder optional", false)
        cy.contains("button", /^Save$/).not("disabled").click()

        cy.setCardField(1, "text area", "Multi line w/o placeholder optional", false)
        cy.contains("button", /^Save$/).not("disabled").click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(2, "text field", "Single line w/ placeholder optional", false)
        cy.get("input[name='placeholder']").type("Single line placeholder")
        cy.contains("button", /^Save$/).not("disabled").click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(3, "text area", "Multi line w/ placeholder optional", false)
        cy.get("input[name='placeholder']").type("Multi line placeholder")
        cy.contains("button", /^Save$/).not("disabled").click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(4, "text field", "Single line w/ placeholder required", true,
            "Custom single line error message")
        cy.get("input[name='placeholder']").type("Single line placeholder required")
        cy.contains("button", /^Save$/).not("disabled").click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(5, "text area", "Multi line w/ placeholder required", true,
            "Custom multi line error message")
        cy.get("input[name='placeholder']").type("Multi line placeholder required")
        cy.contains("button", /^Save$/).not("disabled").click()

        ///////////////////////////////////////////////////////////////////////////////////
        cy.contains("button", "Add new tab").click()
        cy.get("#cardTabName").type("{selectall}{backspace}Checkbox")
        cy.get("#btnIncrRowNumber").click()

        cy.setCardField(0, "check boxes", "CBox optional", false)
        cy.contains("button", /^Add$/).click().click().click()
        cy.get("input[name='options.0.value']").type("Choice A")
        cy.get("input[name='options.1.value']").type("Choice B")
        cy.get("input[name='options.2.value']").type("Choice C")
        cy.contains("button", /^Save$/).not("disabled").click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(1, "check boxes", "CBox required", true, "Custom cbox error message")
        cy.contains("button", /^Add$/).click().click().click()
        cy.get("input[name='options.0.value']").type("Choice 1")
        cy.get("input[name='options.1.value']").type("Choice 2")
        cy.get("input[name='options.2.value']").type("Choice 3")
        cy.contains("button", /^Save$/).not("disabled").click()

        /////////////////////////////////////////////////////////////////////////////////
        cy.contains("button", "Add new tab").click()
        cy.get("#cardTabName").type("{selectall}{backspace}Datepicker")
        cy.get("#btnIncrRowNumber").click().click()
        cy.get("#btnIncrColNumber").click().click()

        cy.setCardField(0, "date picker", "Date picker no default required", true)
        cy.contains("button", /^Save$/).click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(1, "date picker", "Date picker today optional", false)

        cy.get("button[value='today']").click()

        cy.contains("button", /^Save$/).click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(2, "date picker", "Date picker yesterday optional", false)
        cy.get("button[value='custom']").click()

        cy.get("#divCustomDateArea > button").eq(0).click()
        cy.get("#customDateSub").click()

        cy.contains("button", /^Save$/).click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(3, "date picker", "Date picker 2 weeks ago optional", false)
        cy.get("button[value='custom']").click()

        cy.get("#divCustomDateArea > button").eq(0).click()
        cy.get("#customDateSub").click()

        cy.get("#divCustomDateArea > input").type("{backspace}2")

        cy.get("#divCustomDateArea > button").eq(1).click()
        cy.get("#customDateWeek").click()

        cy.contains("button", /^Save$/).click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(4, "date picker", "Date picker 3 months hence optional", false)
        cy.get("button[value='custom']").click()

        cy.get("#divCustomDateArea > input").type("{backspace}3")

        cy.get("#divCustomDateArea > button").eq(1).click()
        cy.get("#customDateMonth").click()

        cy.contains("button", /^Save$/).click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(5, "date picker", "Date picker 1 year hence optional", false)
        cy.get("button[value='custom']").click()

        cy.get("#divCustomDateArea > input").type("{backspace}1")

        cy.get("#divCustomDateArea > button").eq(1).click()
        cy.get("#customDateYear").click()

        cy.contains("button", /^Save$/).click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(6, "date picker", "Date picker no default optional", false)
        cy.contains("button", /^Save$/).click()

        ///////////////////////////////////////////////////////////////////////////////////
        cy.contains("button", "Add new tab").click()
        cy.get("#cardTabName").type("{selectall}{backspace}Drop down")
        cy.get("#btnIncrRowNumber").click()

        cy.setCardField(0, "drop down", "Dropdown optional", false)
        cy.contains("button", /^Add$/).click().click().click()
        cy.get("input[name='options.0.value']").type("Choice i")
        cy.get("input[name='options.1.value']").type("Choice ii")
        cy.get("input[name='options.2.value']").type("Choice iii")
        cy.contains("button", /^Save$/).click()
        ///////////////////////////////////////////////////////////////////////////////////
        cy.setCardField(1, "drop down", "Dropdown required", false)
        cy.contains("button", /^Add$/).click().click().click()
        cy.get("input[name='options.0.value']").type("Choice a")
        cy.get("input[name='options.1.value']").type("Choice b")
        cy.get("input[name='options.2.value']").type("Choice c")
        cy.get("button[role='switch']").click()
        cy.contains("button", /^Save$/).click()

        ///////////////////////////////////////////////////////////////////////////////////
        cy.contains("button", "Add new tab").click()
        cy.get("#cardTabName").type("{selectall}{backspace}Github Branch tracker")

        cy.setCardField(0, "track github branch", "GitHub tracker optional", false)
        cy.contains("button", /^Save$/).click()

        cy.url().then((url) => {
            cy.contains("button", "Save changes").click()
            cy.url().should("not.eq", url)
        })

        // with edited card
        cy.visit(Cypress.env('URL') + "select-board")
        cy.contains("a", testname).click()

        cy.get("#btnCreateDefaultCard").should("have.text", "Test")
        cy.get("#btnCreateDefaultCard").click()

        cy.get(".bg-card").should("have.length", 2)
        cy.get(".bg-card").eq(1).click()

        cy.contains("button", "Save").click()
        cy.get("#cardContents").within(() => {
            cy.get("[role='tablist']").within(() => {
                cy.get("button").should("have.length", 5)
                cy.get("button").eq(0).contains("Basic")
                cy.get("button").eq(0).get("span[role='badTabIndicator']")
                cy.get("button").eq(1).contains("Checkbox")
                cy.get("button").eq(1).get("span[role='badTabIndicator']")
                cy.get("button").eq(2).contains("Datepicker")
                cy.get("button").eq(2).get("span[role='badTabIndicator']")
                cy.get("button").eq(3).contains("Drop down")
                cy.get("button").eq(3).get("span[role='badTabIndicator']")
                cy.get("button").eq(4).contains("Github Branch tracker")
                cy.get("button").eq(4).get("span[role='badTabIndicator']")
            })

            cy.get("[role='tabpanel']").should("have.length", 5)
            cy.get("[role='tabpanel']").eq(0).within(() => {
                cy.get("div").eq(0).within(() => {
                    cy.get("div").should("have.length", 6)
                    cy.get("div").eq(0).within(() => {
                        cy.checkCardField("Single line w/o placeholder optional", false)
                        cy.get("input").should("have.attr", "placeholder", "")
                    })
                    cy.get("div").eq(1).within(() => {
                        cy.checkCardField("Multi line w/o placeholder optional", false)
                        cy.get("textarea").should("have.attr", "placeholder", "")
                    })
                    cy.get("div").eq(2).within(() => {
                        cy.checkCardField("Single line w/ placeholder optional", false)
                        cy.get("input").should("have.attr", "placeholder", "Single line placeholder")
                    })
                    cy.get("div").eq(3).within(() => {
                        cy.checkCardField("Multi line w/ placeholder optional", false)
                        cy.get("textarea").should("have.attr", "placeholder", "Multi line placeholder")
                    })
                    cy.get("div").eq(4).within(() => {
                        cy.checkCardField("Single line w/ placeholder required *", true, "Custom single line error message")
                        cy.get("input").should("have.attr", "placeholder", "Single line placeholder required")
                        cy.get("input").type("a")
                    })
                    cy.get("div").eq(5).within(() => {
                        cy.checkCardField("Multi line w/ placeholder required *", true, "Custom multi line error message")
                        cy.get("textarea").should("have.attr", "placeholder", "Multi line placeholder required")
                        cy.get("textarea").type("a")
                    })
                })
            })

            cy.contains("button", "Checkbox").click()
            cy.get("[role='tabpanel']").eq(1).within(() => {
                cy.get("div").eq(0).within(() => {
                    cy.get("div[role='checkbox']").should("have.length", 2)
                    cy.get("div[role='checkbox']").eq(0).within(() => {
                        cy.checkCardField("CBox optional", false)

                        cy.get("div").should("have.length", 3)
                        cy.get("div").eq(0).within(() => {
                            cy.get("label").should("have.text", "Choice A")
                        })
                        cy.get("div").eq(1).within(() => {
                            cy.get("label").should("have.text", "Choice B")
                        })
                        cy.get("div").eq(2).within(() => {
                            cy.get("label").should("have.text", "Choice C")
                        })
                    })
                    cy.get("div[role='checkbox']").eq(1).within(() => {
                        cy.checkCardField("CBox required *", true)

                        cy.get("div").should("have.length", 3)
                        cy.get("div").eq(0).within(() => {
                            cy.get("label").should("have.text", "Choice 1")
                        })
                        cy.get("div").eq(1).within(() => {
                            cy.get("label").should("have.text", "Choice 2")
                        })
                        cy.get("div").eq(2).within(() => {
                            cy.get("label").should("have.text", "Choice 3")
                            cy.contains("label", "Choice 3").click()
                        })
                    })
                })
            })
        })

        const OPTIONS: any = { day: 'numeric', month: 'long', year: "numeric" }
        const dayEndStr = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

        cy.contains("button", "Datepicker").click()
        cy.get("[role='tabpanel']").eq(2).within(() => {
            cy.get("div").eq(0).within(() => {
                cy.get("div[role='datepicker']").should("have.length", 7)
                cy.get("div[role='datepicker']").eq(0).within(() => {
                    cy.checkCardField("Date picker no default required *", true, "Required")
                    cy.get("button > span").should("have.text", "Pick a date")
                    cy.get("button").click()
                })
            })
        })

        cy.get("table[role='grid']").within(() => {
            cy.contains("button", "1").click()
        })

        cy.get("[role='tabpanel']").eq(2).within(() => {
            cy.get("div").eq(0).within(() => {
                cy.get("div[role='datepicker']").eq(1).within(() => {
                    cy.checkCardField("Date picker today optional", false, "Required")

                    const dateSplit = new Date().toLocaleString('default', OPTIONS).split(" ")
                    const day = parseInt(dateSplit[1])
                    cy.get("button")
                        .should("have.text", `${dateSplit[0]} ${day + dayEndStr[day % 10]}, ${dateSplit[2]}`)
                })
                cy.get("div[role='datepicker']").eq(2).within(() => {
                    cy.checkCardField("Date picker yesterday optional", false, "Required")

                    const dateToBeStored = new Date()
                    dateToBeStored.setDate(dateToBeStored.getDate() - 1)
                    const dateSplit = dateToBeStored.toLocaleString('default', OPTIONS).split(" ")
                    const day = parseInt(dateSplit[1])
                    cy.get("button")
                        .should("have.text", `${dateSplit[0]} ${day + dayEndStr[day % 10]}, ${dateSplit[2]}`)
                })
                cy.get("div[role='datepicker']").eq(3).within(() => {
                    cy.checkCardField("Date picker 2 weeks ago optional", false, "Required")

                    const dateToBeStored = new Date()
                    dateToBeStored.setDate(dateToBeStored.getDate() - 2 * 7)
                    const dateSplit = dateToBeStored.toLocaleString('default', OPTIONS).split(" ")
                    const day = parseInt(dateSplit[1])
                    cy.get("button")
                        .should("have.text", `${dateSplit[0]} ${day + dayEndStr[day % 10]}, ${dateSplit[2]}`)
                })
                cy.get("div[role='datepicker']").eq(4).within(() => {
                    cy.checkCardField("Date picker 3 months hence optional", false, "Required")

                    const dateToBeStored = new Date()
                    dateToBeStored.setMonth(dateToBeStored.getMonth() + 3)
                    const dateSplit = dateToBeStored.toLocaleString('default', OPTIONS).split(" ")
                    const day = parseInt(dateSplit[1])
                    cy.get("button")
                        .should("have.text", `${dateSplit[0]} ${day + dayEndStr[day % 10]}, ${dateSplit[2]}`)
                })
                cy.get("div[role='datepicker']").eq(5).within(() => {
                    cy.checkCardField("Date picker 1 year hence optional", false, "Required")

                    const dateToBeStored = new Date()
                    dateToBeStored.setFullYear(dateToBeStored.getFullYear() + 1)
                    const dateSplit = dateToBeStored.toLocaleString('default', OPTIONS).split(" ")
                    const day = parseInt(dateSplit[1])
                    cy.get("button")
                        .should("have.text", `${dateSplit[0]} ${day + dayEndStr[day % 10]}, ${dateSplit[2]}`)
                })
                cy.get("div[role='datepicker']").eq(6).within(() => {
                    cy.checkCardField("Date picker no default optional", false)
                    cy.get("button > span").should("have.text", "Pick a date")
                })
            })
        })

        cy.contains("button", "Drop down").click()
        cy.get("[role='tabpanel']").eq(3).within(() => {
            cy.get("div").eq(0).within(() => {
                cy.get("div[role='dropdown']").should("have.length", 2)
                cy.get("div[role='dropdown']").eq(0).within(() => {
                    cy.checkCardField("Dropdown optional", false)
                    cy.get("button[role='combobox']").click()
                })
            })
        })
        cy.get("div[role='option']").should("have.length", 3)
        cy.get("div[role='option']").eq(0).should("have.text", "Choice i")
        cy.get("div[role='option']").eq(1).should("have.text", "Choice ii")
        cy.get("div[role='option']").eq(2).should("have.text", "Choice iii")
        // click drop down again to hide
        cy.get("[role='tabpanel']").eq(3).get("div").eq(0).get("div[role='dropdown']").eq(0).within(() => {
            cy.get("button[role='combobox']").click()
        })

        cy.get("[role='tabpanel']").eq(3).within(() => {
            cy.get("div").eq(0).within(() => {
                cy.get("div[role='dropdown']").should("have.length", 2)
                cy.get("div[role='dropdown']").eq(1).within(() => {
                    cy.checkCardField("Dropdown required *", true, "")
                    cy.get("button[role='combobox']").click()
                })
            })
        })
        cy.get("div[role='option']").should("have.length", 3)
        cy.get("div[role='option']").eq(0).should("have.text", "Choice a")
        cy.get("div[role='option']").eq(1).should("have.text", "Choice b")
        cy.get("div[role='option']").eq(2).should("have.text", "Choice c")
        cy.contains("div", "Choice c").click()

        cy.contains("button", "Save").click()
        cy.get("[role='tablist']").within(() => {
            cy.get("button").eq(0).get("span[role='badTabIndicator']").should("not.exist")
            cy.get("button").eq(1).get("span[role='badTabIndicator']").should("not.exist")
            cy.get("button").eq(2).get("span[role='badTabIndicator']").should("not.exist")
            cy.get("button").eq(3).get("span[role='badTabIndicator']").should("not.exist")
        })

        cy.reload()
        cy.get(".bg-card").should("have.length", 2)
        cy.get(".bg-card").eq(1).click()

        cy.get("#cardContents").within(() => {
            cy.get("[role='tabpanel']").should("have.length", 5)
            cy.get("[role='tabpanel']").eq(0).within(() => {
                cy.get("div").eq(0).within(() => {
                    cy.get("div").should("have.length", 6)
                    cy.get("div").eq(4).within(() => {
                        cy.get("input").should("have.value", "a")
                    })
                    cy.get("div").eq(5).within(() => {
                        cy.get("textarea").should("have.value", "a")
                    })
                })
            })

            cy.contains("button", "Checkbox").click()
            cy.get("[role='tabpanel']").eq(1).within(() => {
                cy.get("div[role='checkbox']").eq(1).within(() => {
                    cy.get("div").eq(2).within(() => {
                        cy.get("button[data-state='checked']")
                    })
                })
            })

            // ignore date picker because unsure which date is clicked
            cy.contains("button", "Drop down").click()
            cy.get("[role='tabpanel']").eq(3).within(() => {
                cy.get("div[role='dropdown']").eq(1).within(() => {
                    cy.get("button[role='combobox']").should("have.text", "Choice c")
                })
            })
        })

        cy.get("[alt='delete card']").click()
        cy.get("[role='alertdialog']").within(() => {
            cy.get("h2").should("have.text", "Are you absolutely sure?")
            cy.get("p").should("have.text", "Are you sure you want to delete this card? This action is irreversable!")
            cy.contains("button", "Continue").click()
        })

        cy.get(".bg-card").should("have.length", 1)
        cy.reload()
        cy.get(".bg-card").should("have.length", 1)

        cy.contains("button", "Setting").click()
        cy.contains("button", "Advanced").click()
        cy.contains("button", "Delete kanban board").click()
        cy.visit(Cypress.env('URL') + "select-board")
        cy.contains("a", testname).should("not.exist")
    })
})
