import { Table } from "./table-components/Table"
import { KanbanNavBar } from "./components/KanbanNavBar"
import { SettingModalProvider } from "./settings-modal/components/SettingModalProvider"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import { OPTIONS } from "@/utils/authOptions"
import { BoardApiData } from "@/app/types/Board"

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
        return (
            <div>
                You&apos;re not authorised to visit this board
            </div>
        )
    }

    const kanban = await prisma.kanban.findUnique({
        where: {
            id: kanbanId,
        },
        include: {
            kanbanColumns: {
                orderBy: {
                    order: "asc",
                },
            },
            kanbanSwimLanes: {
                orderBy: {
                    order: "asc",
                },
            },
            cards: {
                orderBy: {
                    order: "asc",
                },
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
        redirect("/select-board")
    }

    return (
        <main className="min-h-[95vh]">
            <SettingModalProvider id={kanban.id} title={kanban.title} />
            <KanbanNavBar title={kanban.title} role={userRoleKanban.permission} />
            <Table
                id={kanban.id}
                role={userRoleKanban.permission}
                cards={kanban.cards}
                kanbanColumns={kanban.kanbanColumns}
                kanbanSwimLanes={kanban.kanbanSwimLanes}
                lastKanbanUpdate={kanban.lastKanbanUpdate?.lastChange ?? -1}
            />
        </main>
    )
}

export default SelectKanbanPage;
