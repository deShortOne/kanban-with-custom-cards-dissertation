import { redirect } from "next/navigation"
import { Table } from "./table-components/Table"
import { Kanban } from ".prisma/client"
import { KanbanNavBar } from "./components/KanbanNavBar"
import { prisma } from "@/lib/prisma"

const SelectKanbanPage = async ({
    params
}: {
    params: { id: string }
}) => {
    if (!params.id) {
        redirect("/select-board")
    }

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
                    developer: true
                }
            }
        }
    }) as Kanban

    return (
        <main className="min-h-[95vh]">
            <KanbanNavBar title={kanban.title} kanbanId={parseInt(params.id)} />
            <Table
            id = {kanban.id}
                columns={kanban.KanbanColumns}
                swimlanes={kanban.KanbanSwimLanes}
                cards={kanban.Cards}>
            </Table>
        </main>
    )
}

export default SelectKanbanPage;
