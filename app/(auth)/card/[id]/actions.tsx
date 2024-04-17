import { prisma } from "@/lib/prisma"
import { DataProp, FieldTypeProp, NewField, NullField } from "./component/Base"

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
    const cardTypeIds = await prisma.cardTemplate.groupBy({
        by: ["cardTypeId"],
        where: {
            kanbanId: kanbanId
        }
    })

    const ids = cardTypeIds.map(elem => elem.cardTypeId)

    const cardTypes = await prisma.cardType.findMany({
        where: {
            id: {
                in: ids
            }
        },
        select: {
            id: true,
            name: true,
        }
    })

    return cardTypes
}
