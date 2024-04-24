import { prisma } from "@/lib/prisma"
import { CardType, DataProp, FieldTypeProp } from "@/app/types/CardContents"
import { NewField, NullField } from "./component/Base"

export async function getCardTemplate(cardId: number) {
    const cardTemplate = await prisma.cardTemplate.findFirst({
        where: {
            id: cardId,
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
    }) as DataProp

    cardTemplate.tabs.forEach(tab => {
        for (let x = 1; x <= tab.sizeX; x++) {
            for (let y = 1; y <= tab.sizeY; y++) {
                const field = tab.tabFields.find(i => i.posX === x && i.posY === y)
                if (!field) {
                    tab.tabFields.push({
                        ...NewField,
                        posX: x,
                        posY: y,
                    })
                }
            }
        }
    })

    return cardTemplate
}

export async function getFieldTypes() {
    const fieldTypes = await prisma.fieldType.findMany({
        where: {
            implemented: true,
        },
    }) as FieldTypeProp[]
    fieldTypes.unshift(NullField)
    return fieldTypes
}

export async function getAvailableCardTypes(kanbanId: number) {
    const query = `
    SELECT T1.cardTypeId as id,
        CardType.name as name,
        CardTemplate.id as cardTemplateId
    FROM (
        SELECT cardTypeId, max(version) AS version
        FROM CardTemplate
        WHERE kanbanId = ${kanbanId}
        GROUP BY (cardTypeId)
        ) AS T1
    JOIN CardType
        ON CardType.id = T1.cardTypeId
    JOIN CardTemplate
        ON CardTemplate.cardTypeId = T1.cardTypeId
            AND CardTemplate.version = T1.version
    WHERE kanbanId = ${kanbanId};
    `

    const res: CardType[] = await prisma.$queryRawUnsafe(query)

    return res
}
