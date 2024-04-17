import { DataProp } from "@/app/(auth)/card/[id]/component/Base"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { redirect } from 'next/navigation'
import { insertUpdateCardTemplates } from "../../commonFunctions/Base"

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
        }
    })

    if (!oldCardTemplate)
        return Response.json("Old card template not found")

    if (oldCardTemplate.isDefault) {
        await prisma.cardTemplate.update({
            where: {
                id: data.id,
            },
            data: {
                isDefault: false
            }
        })
    }

    const { id: cardTemplateId } = await prisma.cardTemplate.create({
        data: {
            name: data.name,
            version: oldCardTemplate.version + 1,
            isDefault: oldCardTemplate.isDefault,
            cardTypeId: data.cardTypeId,
            kanbanId: oldCardTemplate.kanbanId,
        }
    })

    // Insert tabs
    const insertTabs: any = data.tabs.map(i => ({
        name: i.name,
        order: i.order,
        sizeX: i.sizeX,
        sizeY: i.sizeY,
        cardTemplateId: cardTemplateId,
    }))
    await prisma.cardTemplateTab.createMany({
        data: insertTabs
    })
    const cardTabs = await prisma.cardTemplateTab.findMany({
        where: {
            cardTemplateId: cardTemplateId
        }
    })

    // Insert tab fields
    const insertTabFields = []
    for (let i = 0; i < data.tabs.length; i++) {
        const currTab = data.tabs[i]
        const currTabDbId = cardTabs.find(i => i.name === currTab.name)?.id as number
        for (let j = 0; j < currTab.tabFields.length; j++) {
            if (currTab.tabFields[j].fieldType.id !== -1) {
                insertTabFields.push({
                    data: currTab.tabFields[j].data,
                    posX: currTab.tabFields[j].posX,
                    posY: currTab.tabFields[j].posY,
                    fieldTypeId: currTab.tabFields[j].fieldType.id,
                    cardTemplateTabId: currTabDbId,
                })
            }
        }
    }
    await prisma.cardTemplateTabField.createMany({
        data: insertTabFields
    })

    insertUpdateCardTemplates(oldCardTemplate.kanbanId)

    redirect("/card/" + cardTemplateId)
}
