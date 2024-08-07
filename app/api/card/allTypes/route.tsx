import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { insertTemplateTabsAndFields } from "../template/actions"
import { insertUpdateCardTemplates } from "../../commonFunctions/Base"
import { CardType } from "@/app/types/CardContents"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const kanbanId = searchParams.get("kanbanId")
    if (!kanbanId)
        return NextResponse.json("Include kanban id", { status: 400 })

    return NextResponse.json(await prisma.cardType.findMany({
        where: {
            activeCardTypes: {
                every: {
                    kanbanId: parseInt(kanbanId)
                }
            }
        }
    }))
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

    const allActiveCardTypes = await prisma.activeCardTypes.findMany({
        where: {
            kanbanId: kanbanId,
        }
    })

    await prisma.activeCardTypes.deleteMany({
        where: {
            kanbanId: kanbanId,
        }
    })

    const cardTypes = await prisma.cardType.findMany({
        where: {
            id: {
                in: oldCardTypeIds
            }
        }
    })

    const aa = Object.entries(data)
        .filter(key_value => parseInt(key_value[0]) > 0)
        .map(async ([a, b]) => {
            dealWithOldCardTypes(parseInt(a),
                b as string,
                kanbanId,
                cardTypes,
                res,
                allActiveCardTypes,
            )
        })

    const bb = newCardTypes.map(i => dealWithNewCardTypes(i, kanbanId, cardTemplateData, res, allActiveCardTypes))

    await Promise.all(aa)
    await Promise.all(bb)

    const cardTypesToCheck = res.filter(i => i.cardTemplateId === -1)
    const query = `
    SELECT T1.cardTypeId AS id,
        CardTemplate.id AS cardTemplateId
    FROM (
        SELECT cardTypeId,
            max(version) AS version
        FROM CardTemplate
        WHERE kanbanId = ${kanbanId}
        AND cardTypeId IN (${cardTypesToCheck.map(i => i.id)})
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
            i.cardTemplateId = cardTemplateId?.cardTemplateId ?? -2
            if (index === cardTypesToCheck.length - 1)
                resolve(true)
        })
    })
    await c

    insertUpdateCardTemplates(kanbanId)

    return NextResponse.json(res)
}

async function dealWithOldCardTypes(
    key: number,
    value: string,
    kanbanId: number,
    cardTypes: { id: number, name: string }[],
    res: CardType[],
    allActiveCardTypes: {
        isDefault: boolean
        version: number
        cardTypeId: number
        kanbanId: number
    }[],
) {
    return new Promise(async (resolve) => {
        const cardType = cardTypes.find(i => i.id === key)
        if (cardType == null || cardType.name === value) {
            res.push({
                id: key,
                name: value,
                cardTemplateId: -1
            })
            const currentActiveCardType = allActiveCardTypes
                .find(i => i.cardTypeId === key && i.kanbanId === kanbanId)
            if (currentActiveCardType == null)
                return
            await prisma.activeCardTypes.create({
                data: currentActiveCardType
            })
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

        // This query is throwing an error even though there should be no error
        const currentActiveCardType = allActiveCardTypes
            .find(i => i.cardTypeId === key && i.kanbanId === kanbanId)
        if (currentActiveCardType == null)
            return
        await prisma.activeCardTypes.create({
            data: {
                ...currentActiveCardType,
                cardTypeId: newCardId
            }
        })

        resolve(true)
    })
}

async function dealWithNewCardTypes(
    cardType: string,
    kanbanId: number,
    cardTemplateData: any,
    res: CardType[],
    allActiveCardTypes: {
        isDefault: boolean
        version: number
        cardTypeId: number
        kanbanId: number
    }[],
) {
    return new Promise(async (resolve) => {
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

        const isTherePreviousVersion = await prisma.cardTemplate.groupBy({
            by: ["cardTypeId"],
            where: {
                kanbanId: kanbanId,
                cardTypeId: newCardTypeId,
            },
            _max: {
                version: true
            }
        })

        let newVersion = 0
        if (isTherePreviousVersion.length === 1) {
            newVersion = isTherePreviousVersion[0]._max.version ?? 0
        }

        const { id: newCardTemplateId } = await prisma.cardTemplate.create({
            data: {
                name: cardTemplateData.name,
                version: newVersion + 1,
                cardTypeId: newCardTypeId,
                kanbanId: kanbanId,
            }
        })
        await prisma.activeCardTypes.create({
            data: {
                cardTypeId: newCardTypeId,
                kanbanId: kanbanId,
                version: newVersion + 1
            }
        })

        insertTemplateTabsAndFields(cardTemplateData, newCardTemplateId)

        res.push({
            id: newCardTypeId,
            name: cardType,
            cardTemplateId: newCardTemplateId
        })

        resolve(true)
    })
}
