import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { insertTemplateTabsAndFields } from "../template/actions"
import { insertUpdateCardTemplates } from "../../commonFunctions/Base"
import { CardType } from "@/app/(auth)/card/[id]/component/Base"
import { any } from "zod"

export async function GET() {
    try {
        return NextResponse.json(await prisma.cardType.findMany())
    } catch {
        return NextResponse.error()
    }
}

export async function POST(req: Request) {
    const data = await req.json()
    const res: CardType[] = []

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

    const a = new Promise((resolve) => {
        Object.entries(data).forEach(async ([a, b], index) => {
            const key = parseInt(a)
            const value = b as string

            if (key <= 0) {
                if (index === Object.keys(data).length - 1) {
                    resolve(true)
                }
                return
            }
            const cardType = cardTypes.find(i => i.id === key)
            if (cardType == null || cardType.name === value) {
                res.push({
                    id: key,
                    name: value,
                    cardTemplateId: -1
                })
                if (index === Object.keys(data).length - 1) {
                    resolve(true)
                }
                return
            }

            let newCardId = -1
            const preexistingCardType = await prisma.cardType.findFirst({
                where: {
                    name: value as string
                }
            })

            // If name was not the same as before but there already exists a name for this card type, then change to that name
            if (preexistingCardType === null) {
                const newCardType = await prisma.cardType.create({
                    data: {
                        name: value
                    }
                })
                newCardId = newCardType.id
            } else {
                newCardId = preexistingCardType.id
            }

            await prisma.cardTemplate.updateMany({
                where: {
                    kanbanId: kanbanId,
                    cardTypeId: key
                },
                data: {
                    cardTypeId: newCardId
                }
            })

            res.push({
                id: newCardId,
                name: value,
                cardTemplateId: -1
            })
            if (index === Object.keys(data).length - 1) {
                resolve(true)
            }
        })
    })

    const b = new Promise((resolve) => {
        newCardTypes.forEach(async (cardType, index) => {
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
                    cardTypeId: newCardTypeId,
                    kanbanId: kanbanId,
                }
            })

            insertTemplateTabsAndFields(cardTemplateData, newCardTemplateId)

            res.push({
                id: newCardTypeId,
                name: cardType,
                cardTemplateId: newCardTemplateId
            })

            if (index === newCardTypes.length - 1) {
                resolve(true)
            }
        })
    })

    await a
    await b

    const cardTypesToCheck = res.filter(i => i.cardTemplateId === -1)
    const query = `
    SELECT T1.cardTypeId AS id,
        CardTemplate.id AS cardTemplateId
    FROM (
        SELECT cardTypeId,
            max(version) AS version
        FROM CardTemplate
        WHERE kanbanId = ${kanbanId}
        AND id IN (${cardTypesToCheck.map(i => i.id)})
        GROUP BY (cardTypeId)
        ) AS T1
    JOIN CardTemplate
        ON CardTemplate.cardTypeId = T1.cardTypeId
            AND CardTemplate.version = T1.version
    WHERE kanbanId = ${kanbanId};
    `

    const cardTemplateIds: { id: number, cardTemplateId: number }[] = await prisma.$queryRawUnsafe(query)

    const c = new Promise((resolve) => {
        cardTypesToCheck.forEach((i, index) => {
            const cardTemplateId = cardTemplateIds.find(j => j.id === i.id)
            i.cardTemplateId = cardTemplateId?.cardTemplateId ?? -1
            if (index === cardTypesToCheck.length - 1)
                resolve(true)
        })
    })
    await c

    insertUpdateCardTemplates(kanbanId)

    return NextResponse.json(res)
}
