import { Table } from "./table-components/Table"
import { Kanban } from ".prisma/client"
import { KanbanNavBar } from "./components/KanbanNavBar"
import { prisma } from "@/lib/prisma"

const SelectKanbanPage = async ({
    params
}: {
    params: { id: string }
}) => {
    const kanban = await prisma.kanban.findUnique({
        where: {
            id: parseInt(params.id)
        },
        include: {
            KanbanColumns: {
                orderBy: {
                    order: "asc"
                }
            },
            KanbanSwimLanes: {
                orderBy: {
                    order: "asc"
                }
            },
            Cards: {
                include: {
                    cardTemplate: {
                        select: {
                            cardType: true
                        }
                    }
                }
            }
        }
    }) as Kanban

    console.log(kanban.Cards)

    // prisma should include the included types but seems to be broken
    return (
        <main className="min-h-[95vh]">
            <KanbanNavBar title={kanban.title} kanbanId={parseInt(params.id)} />
            <Table
                id={kanban.id}
                columns={kanban.KanbanColumns}
                swimlanes={kanban.KanbanSwimLanes}
                cards={kanban.Cards}>
            </Table>
        </main>
    )
}

export default SelectKanbanPage;
