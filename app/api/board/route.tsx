import { BoardApiData } from "@/app/types/Board"
import { prisma } from "@/lib/prisma"
import { OPTIONS } from "@/utils/authOptions"
import { getServerSession } from 'next-auth/next'

interface orderByOrderType {
    orderBy: {
        order: "asc"
    }
}
const orderByOrder: orderByOrderType = {
    orderBy: {
        order: "asc",
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(OPTIONS)

    const { searchParams } = new URL(request.url)
    const kanbanId = searchParams.get("kanbanId")
    let lastTime = searchParams.get("lastKanbanUpdate")

    if (kanbanId === null || kanbanId === "") {
        return new Response("include kanban id", {
            status: 404,
        })
    }
    if (lastTime === null || lastTime === "") {
        lastTime = "0"
    }

    const kanban = await prisma.kanban.findUnique({
        where: {
            id: parseInt(kanbanId),
        },
        include: {
            KanbanColumns: orderByOrder,
            KanbanSwimLanes: orderByOrder,
            Cards: {
                ...orderByOrder,
                include: {
                    cardTemplate: {
                        select: {
                            cardType: true,
                        }
                    }
                },
            },
            LastKanbanUpdate: {
                select: {
                    lastChange: true
                }
            }
        }
    })
    if (kanban === null) {
        return Response.error()
    }
    if (lastTime === "0") {
        const response: BoardApiData = {
            updateCardPositions: true,
            Cards: kanban.Cards,

            updateColumnPositions: true,
            KanbanColumns: kanban.KanbanColumns,
            updateSwimLanePositions: true,
            KanbanSwimLanes: kanban.KanbanSwimLanes,

            LastKanbanUpdate: kanban.LastKanbanUpdate[0].lastChange,

            updateCardTemplates: true,

            updateCardData: false,
            updatedCardIds: []
        }
        return Response.json(response)
    } else {
        const changes = await prisma.trackChanges.groupBy({
            by: ["kanbanId"],
            where: {
                timestamp: {
                    gt: parseInt(lastTime)
                },
                kanbanId: parseInt(kanbanId),
                userId: {
                    not: session?.user.id!
                },
            },
            _max: {
                updateCardPositions: true,
                updateColumnPositions: true,
                updateSwimLanePositions: true,
                updateCardTemplates: true,
                updateCardData: true,
            }
        })

        // Early exit ~~
        if (changes.length === 0) {
            const response: BoardApiData = {
                updateCardPositions: false,
                Cards: [],

                updateColumnPositions: false,
                KanbanColumns: [],

                updateSwimLanePositions: false,
                KanbanSwimLanes: [],

                updateCardTemplates: false,

                updateCardData: false,
                updatedCardIds: [],

                LastKanbanUpdate: kanban.LastKanbanUpdate[0].lastChange,
            }
            return Response.json(response)
        }

        const response: BoardApiData = {
            updateCardPositions: falseIfNullOrFalse(changes[0]._max.updateCardPositions),
            Cards: falseIfNullOrFalse(changes[0]._max.updateCardPositions) ? kanban.Cards : [],

            updateColumnPositions: falseIfNullOrFalse(changes[0]._max.updateColumnPositions),
            KanbanColumns: falseIfNullOrFalse(changes[0]._max.updateColumnPositions) ? kanban.KanbanColumns : [],

            updateSwimLanePositions: falseIfNullOrFalse(changes[0]._max.updateSwimLanePositions),
            KanbanSwimLanes:
                falseIfNullOrFalse(changes[0]._max.updateColumnPositions) ? kanban.KanbanSwimLanes : [],

            updateCardTemplates: falseIfNullOrFalse(changes[0]._max.updateCardTemplates),

            updateCardData: falseIfNullOrFalse(changes[0]._max.updateCardData),
            updatedCardIds: [],

            LastKanbanUpdate: kanban.LastKanbanUpdate[0].lastChange,
        }

        if (response.updateCardData) {
            const cardIdsUpdatedLis = await prisma.trackChanges.findMany({
                where: {
                    timestamp: {
                        gt: parseInt(lastTime)
                    },
                    kanbanId: parseInt(kanbanId),
                    updateCardData: true,
                },
            })

            response.updatedCardIds = cardIdsUpdatedLis.map(i => i.updatedCardId) as number[]
        }

        return Response.json(response)
    }
}

function falseIfNullOrFalse(a: boolean | null) {
    return a !== null && a
}
