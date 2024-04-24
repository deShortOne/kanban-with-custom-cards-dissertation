import { DataProp } from "@/app/types/CardContents"
import { prisma } from "@/lib/prisma"

export async function insertTemplateTabsAndFields(data: DataProp, cardTemplateId: number) {
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
}
