import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Table } from "./components/Table"
import { Kanban } from ".prisma/client"

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
            Cards: true
        }
    }) as Kanban

    return (
        <main className="">
            <Table
                columns={kanban.KanbanColumns}
                swimlanes={kanban.KanbanSwimLanes}
                cards={kanban.Cards}>
            </Table>
        </main>
    )
}

export default SelectKanbanPage;
