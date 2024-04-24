
import { getServerSession } from 'next-auth/next'
import { prisma } from "@/lib/prisma"
import MainContent from "./MainContent"
import { Role } from '@prisma/client'
import { getAvailableCardTypes, getCardTemplate, getFieldTypes } from './actions'
import { OPTIONS } from '@/utils/authOptions'

const UpdateCardPage = async ({
    params
}: {
    params: { id: string }
}) => {
    const cardId = parseInt(params.id)
    const session = await getServerSession(OPTIONS)

    const userRole = await prisma.userRoleKanban.findFirst({
        where: {
            kanban: {
                cardTemplate: {
                    some: {
                        id: cardId
                    }
                }
            },
            user: {
                githubId: session?.user.id
            }
        },
        include: {
            kanban: {
                select: {
                    title: true
                }
            }
        }
    })

    if (userRole === null) {
        return (
            <div>
                You do not have access to this board
            </div>
        )
    }
    if (userRole.permission !== Role.EDITOR) {
        return (
            <div>
                {"You must be an editor on the kanban board, " + userRole.kanban.title + ", to edit cards"}
            </div>
        )
    }

    const cardTemplate = await getCardTemplate(cardId)
    const fieldTypes = await getFieldTypes()
    const cardTypes = await getAvailableCardTypes(userRole.kanbanId)
    const initialCardTypeId = cardTemplate.cardTypeId

    return (
        <MainContent
            cardTemplate={cardTemplate}
            fieldTypes={fieldTypes}
            cardTypes={cardTypes}
            kanbanId={userRole.kanbanId}
            initialCardTypeId={initialCardTypeId}
        />
    )
}

export default UpdateCardPage;
