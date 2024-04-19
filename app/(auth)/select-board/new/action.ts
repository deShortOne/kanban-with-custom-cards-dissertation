"use server"

import { Role, User } from "@prisma/client"
import { getServerSession } from 'next-auth/next'
import { OPTIONS } from "@/utils/authOptions"
import { prisma } from "@/lib/prisma"
import { insertNewKanban } from "@/app/api/commonFunctions/Base"
import { redirect } from "next/navigation"

export async function submitFormAA(formData: FormData) {
    const kanban = await setBoardInitialData(formData.get("name") as string)

    const id = await getUserId();
    if (id == -1) {
        return Response.json({ status: false })
    }

    await prisma.userRoleKanban.create({
        data: {
            userId: id,
            kanbanId: kanban.id,
            permission: Role.EDITOR
        }
    })

    insertNewKanban(kanban.id)

    redirect("/board/" + kanban.id)
}

async function setBoardInitialData(name: string) {
    const kanban = await prisma.kanban.create({
        include: {
            KanbanColumns: true,
            KanbanSwimLanes: true,
            CardTemplate: {
                include: {
                    tabs: {
                        include: {
                            tabFields: {
                                include: {
                                    fieldType: true
                                }
                            }
                        }
                    }
                }
            }
        },
        data: {
            title: name,
            KanbanColumns: {
                createMany: {
                    data: [
                        { title: "To do", order: 1, },
                        { title: "Doing", order: 1, },
                        { title: "Done", order: 2 },
                    ],
                }
            },
            KanbanSwimLanes: {
                createMany: {
                    data: [
                        { title: "Team 1", order: 1, },
                        { title: "Team 2", order: 2, },
                    ]
                }
            },
            ActiveCardTypes: {
                create: [{
                    version: 1,
                    cardTypeId: 1,
                    isDefault: true,
                }, {
                    version: 1,
                    cardTypeId: 2,
                    isDefault: true,
                }]
            },
            CardTemplate: {
                create: [{
                    name: "task",
                    version: 1,
                    cardTypeId: 1,
                    tabs: {
                        create: [{
                            name: "Base information",
                            order: 1,
                            sizeX: 1,
                            sizeY: 2,

                            tabFields: {
                                create: [{
                                    posX: 1,
                                    posY: 1,
                                    fieldTypeId: 1,
                                    data: "Short description"
                                },
                                {
                                    posX: 1,
                                    posY: 2,
                                    fieldTypeId: 2,
                                    data: "Extended description",
                                }]
                            }
                        },
                        {
                            name: "Github",
                            order: 2,
                            sizeX: 1,
                            sizeY: 1,

                            tabFields: {
                                create: {
                                    posX: 1,
                                    posY: 1,
                                    fieldTypeId: 8,
                                    data: "To be done",
                                }
                            }
                        }],
                    }
                },
                {
                    name: "bug",
                    version: 1,
                    cardTypeId: 2,
                    tabs: {
                        create: [{
                            name: "Error",
                            order: 1,
                            sizeX: 2,
                            sizeY: 2,

                            tabFields: {
                                create: [{
                                    posX: 1,
                                    posY: 1,
                                    fieldTypeId: 2,
                                    data: "Steps to reproduce error",
                                },
                                {
                                    posX: 1,
                                    posY: 2,
                                    fieldTypeId: 1,
                                    data: "Actual results",
                                },
                                {
                                    posX: 2,
                                    posY: 2,
                                    fieldTypeId: 1,
                                    data: "Expected result",
                                }]
                            }
                        }]
                    }
                }],
            },
        }
    })

    await prisma.card.create({
        data: {
            kanbanId: kanban.id,
            title: "Start here",
            columnId: -1,
            swimLaneId: -1,
            cardTemplateId: kanban.CardTemplate[0].id,
            order: 1,
            allTabsFieldInformation: {
                create: [{
                    cardTemplateTabFieldId: kanban.CardTemplate[0].tabs[0].tabFields[0].id,
                    data: "Create new cards by clicking New Task above the card"
                },
                {
                    cardTemplateTabFieldId: kanban.CardTemplate[0].tabs[0].tabFields[1].id,
                    data: "You can create Bug cards by clicking on the down arrow next to New Task\nAlternatively, you can customise the cards as you see fit!"
                },
                {
                    cardTemplateTabFieldId: kanban.CardTemplate[0].tabs[1].tabFields[0].id,
                    data: "This is to be implemented in the future"
                }]
            }
        }
    })

    return kanban
}

async function getUserId() {
    // ideally I should be pulling from an api, but I couldn't get it to work
    const session = await getServerSession(OPTIONS);
    if (!session || !session.user) {
        return -1
    }
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            githubId: session.user.id
        }
    })
    return user.id
}
