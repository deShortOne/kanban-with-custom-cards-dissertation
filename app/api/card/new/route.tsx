import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { insertUpdateCardPositions } from "../../commonFunctions/Base";

export async function POST(req: Request) {
    const data = await req.json()

    const cardTemplate = await prisma.cardTemplate.findFirst({
        where: {
            id: data.cardTemplateId
        },
        include: {
            tabs: {
                include: {
                    tabFields: {
                        include: {
                            fieldType: true
                        }
                    }
                }
            }
        }
    })

    if (!cardTemplate) {
        return NextResponse.json(-1)
    }

    const toUpdate = await prisma.card.create({
        data: {
            title: "To be updated",
            order: data.order,
            description: null,
            columnId: -1,
            swimLaneId: -1,
            kanbanId: data.boardId,
            cardTemplateId: data.cardTemplateId,
        },
    })

    const tabFieldData: { cardId: number, data: string, cardTemplateTabFieldId: number }[] = []
    for (let i = 0; i < cardTemplate.tabs.length; i++) {
        const currTab = cardTemplate.tabs[i]
        for (let j = 0; j < cardTemplate.tabs[i].tabFields.length; j++) {
            const currField = currTab.tabFields[j]
            let data = ""

            if (currField.fieldType.name === "Date picker") {
                const defaultInfoLis = currField.data.split(";")[1].split(" ")
                if (defaultInfoLis.length === 3) {
                    const dateToBeStored = new Date()
                    const range = parseInt(defaultInfoLis[1]) * (defaultInfoLis[0] === "add" ? 1 : -1)

                    switch (defaultInfoLis[2]) {
                        case "day":
                        case "days":
                            dateToBeStored.setDate(dateToBeStored.getDate() + range)
                            break
                        case "week":
                        case "weeks":
                            dateToBeStored.setDate(dateToBeStored.getDate() + (range * 7))
                            break
                        case "month":
                        case "months":
                            dateToBeStored.setMonth(dateToBeStored.getMonth() + range)
                            break
                        case "year":
                        case "years":
                            dateToBeStored.setFullYear(dateToBeStored.getFullYear() + range)
                            break
                    }

                    data = dateToBeStored.toString()
                } else if (defaultInfoLis.length === 1 && defaultInfoLis[0] === "today") {
                    data = (new Date()).toString()
                }
            }

            tabFieldData.push(
                {
                    cardId: toUpdate.id,
                    data: data,
                    cardTemplateTabFieldId: currField.id,
                }
            )
        }
    }

    await prisma.cardTabField.createMany({
        data: tabFieldData,
    })

    insertUpdateCardPositions(data.boardId)

    if (toUpdate) {
        return NextResponse.json(toUpdate.id);
    } else {
        return NextResponse.json(-1);
    }
}
