import { Table } from "./table-components/Table"
import { KanbanNavBar } from "./components/KanbanNavBar"
import { SettingModalProvider } from "./settings-modal/components/SettingModalProvider"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route"

const SelectKanbanPage = async ({
    params
}: {
    params: { id: string }
}) => {
    const kanbanId = parseInt(params.id)

    const session = await getServerSession(OPTIONS)
    if (!session?.user) {
        return (<div>Invalid session</div>)
    }

    const userRoleKanban = await prisma.userRoleKanban.findFirst({
        where: {
            user: {
                githubId: session.user.id,
            },
            kanbanId: kanbanId,
        }
    })

    if (userRoleKanban === null) {
        return (<div>You're not authorised to visit this board</div>)
    }

    const kanban = await prisma.kanban.findUnique({
        where: {
            id: kanbanId,
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
                cards={kanban.Cards}
                role={userRoleKanban.permission}
            />
        </main>
    )
}

export default SelectKanbanPage;
