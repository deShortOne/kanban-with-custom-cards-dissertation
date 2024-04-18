import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { insertTemplateTabsAndFields } from "../template/route"
import { insertUpdateCardTemplates } from "../../commonFunctions/Base"

export async function GET() {
    try {
        return NextResponse.json(await prisma.cardType.findMany())
    } catch {
        return NextResponse.error()
    }
}

export async function POST(req: Request) {
    const data = await req.json()

    const kanbanId = data["kanbanId"]
    delete data["kanbanId"]
    const cardTemplateData = data["cardTemplateData"]
    delete data["cardTemplateData"]

    const oldCardTypeIds = Object.keys(data).filter(i => parseInt(i) > 0).map(i => parseInt(i))
    const newCardTypes = Object.keys(data).filter(i => parseInt(i) <= 0).map(i => data[i])

    const cardTypes = await prisma.cardType.findMany({
        where: {
            id: {
                in: oldCardTypeIds
            }
        }
    })

    oldCardTypeIds.forEach(async (i) => {
        if (cardTypes[i].name === data[i].name) {
            return
        }
        let newCardId = -1
        const preexistingCardType = await prisma.cardType.findFirst({
            where: {
                name: data[i].name
            }
        })

        if (preexistingCardType === null) {
            const newCardType = await prisma.cardType.create({
                data: {
                    name: data[i].name
                }
            })
            newCardId = newCardType.id
        } else {
            newCardId = preexistingCardType.id
        }

        await prisma.cardTemplate.updateMany({
            where: {
                kanbanId: kanbanId,
                cardTypeId: i
            },
            data: {
                cardTypeId: newCardId
            }
        })
    })

    newCardTypes.forEach(async (cardType) => {
        const preexistingCardType = await prisma.cardType.findFirst({
            where: {
                name: cardType
            }
        })
        let newCardTypeId = -1
        if (preexistingCardType === null) {
            const newCardType = await prisma.cardType.create({
                data: {
                    name: cardType
                }
            })
            newCardTypeId = newCardType.id
        } else {
            newCardTypeId = preexistingCardType.id
        }

        const { id: newCardTemplateId } = await prisma.cardTemplate.create({
            data: {
                name: cardTemplateData.name,
                version: 1,
                isDefault: false,
                cardTypeId: newCardTypeId,
                kanbanId: kanbanId,
            }
        })

        insertTemplateTabsAndFields(cardTemplateData, newCardTemplateId)
    })

    insertUpdateCardTemplates(kanbanId)

    return NextResponse.json(1)
}
