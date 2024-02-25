import { Table } from "./table-components/Table"
import { KanbanNavBar } from "./components/KanbanNavBar"
import { SettingModalProvider } from "./settings-modal/components/SettingModalProvider"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

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
    })
    if (kanban === null) {
        redirect("/select-board")
    }

    return (
        <main className="min-h-[95vh]">
            <SettingModalProvider id={kanban.id} title={kanban.title} />
            <KanbanNavBar title={kanban.title} />
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
