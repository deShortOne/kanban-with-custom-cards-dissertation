import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const kanbanId = searchParams.get("kanbanId")

    if (kanbanId === null || kanbanId === "") {
        return new Response("include kanban id", {
            status: 404,
        })
    }

    const kanban = await prisma.kanban.findUnique({
        where: {
            id: parseInt(kanbanId),
        },
        include: {
            KanbanColumns: {
                orderBy: {
                    order: "asc",
                }
            },
            KanbanSwimLanes: {
                orderBy: {
                    order: "asc",
                }
            },
            Cards: {
                include: {
                    cardTemplate: {
                        select: {
                            cardType: true,
                        }
                    }
                },
                orderBy: {
                    order: "asc"
                }
            }
        }
    })

    return Response.json(kanban)
}
