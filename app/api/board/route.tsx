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
            kanbanColumns: orderByOrder,
            kanbanSwimLanes: orderByOrder,
            cards: {
                ...orderByOrder,
                include: {
                    cardTemplate: {
                        select: {
                            cardType: true,
                        }
                    }
                },
            },
            lastKanbanUpdate: {
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
            cards: kanban.cards,

            updateColumnPositions: true,
            kanbanColumns: kanban.kanbanColumns,
            updateSwimLanePositions: true,
            kanbanSwimLanes: kanban.kanbanSwimLanes,

            lastKanbanUpdate: kanban.lastKanbanUpdate?.lastChange ?? -1,

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
                cards: [],

                updateColumnPositions: false,
                kanbanColumns: [],

                updateSwimLanePositions: false,
                kanbanSwimLanes: [],

                updateCardTemplates: false,

                updateCardData: false,
                updatedCardIds: [],

                lastKanbanUpdate: kanban.lastKanbanUpdate?.lastChange ?? -1,
            }
            return Response.json(response)
        }

        const response: BoardApiData = {
            updateCardPositions: falseIfNullOrFalse(changes[0]._max.updateCardPositions),
            cards: falseIfNullOrFalse(changes[0]._max.updateCardPositions) ? kanban.cards : [],

            updateColumnPositions: falseIfNullOrFalse(changes[0]._max.updateColumnPositions),
            kanbanColumns: falseIfNullOrFalse(changes[0]._max.updateColumnPositions) ? kanban.kanbanColumns : [],

            updateSwimLanePositions: falseIfNullOrFalse(changes[0]._max.updateSwimLanePositions),
            kanbanSwimLanes:
                falseIfNullOrFalse(changes[0]._max.updateColumnPositions) ? kanban.kanbanSwimLanes : [],

            updateCardTemplates: falseIfNullOrFalse(changes[0]._max.updateCardTemplates),

            updateCardData: falseIfNullOrFalse(changes[0]._max.updateCardData),
            updatedCardIds: [],

            lastKanbanUpdate: kanban.lastKanbanUpdate?.lastChange ?? -1,
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
