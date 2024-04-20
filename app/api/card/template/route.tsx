import { DataProp } from "@/app/types/CardContents"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { redirect } from 'next/navigation'
import { insertUpdateCardTemplates } from "../../commonFunctions/Base"
import { insertTemplateTabsAndFields } from "./actions"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const cardTemplateId = url.searchParams.get("cardTemplateId")!

    const cardTemplate = await prisma.cardTemplate.findFirst({
        where: {
            id: parseInt(cardTemplateId),
        },
        include: {
            tabs: {
                include: {
                    tabFields: {
                        include: {
                            fieldType: true
                        }
                    }
                },
                orderBy: {
                    order: "asc"
                }
            }
        }
    })

    return NextResponse.json(cardTemplate);
}

export async function POST(req: Request) {
    const data: DataProp = await req.json()

    // insert CardTemplate
    const oldCardTemplate = await prisma.cardTemplate.findFirst({
        where: {
            id: data.id
        },
    })

    if (!oldCardTemplate)
        return Response.json("Old card template not found")

    const { id: cardTemplateId } = await prisma.cardTemplate.create({
        data: {
            name: data.name,
            version: oldCardTemplate.version + 1,
            cardTypeId: data.cardTypeId,
            kanbanId: oldCardTemplate.kanbanId,
        }
    })
    await prisma.activeCardTypes.update({
        where: {
            cardTypeId_kanbanId: {
                cardTypeId: data.cardTypeId,
                kanbanId: oldCardTemplate.kanbanId
            }
        },
        data: {
            version: oldCardTemplate.version + 1
        }
    })

    insertTemplateTabsAndFields(data, cardTemplateId)

    insertUpdateCardTemplates(oldCardTemplate.kanbanId)

    redirect("/card/" + cardTemplateId)
}
