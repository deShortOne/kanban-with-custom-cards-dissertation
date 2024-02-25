import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url)
    const kanbanId = parseInt(url.searchParams.get("kanbanId")!)

    const latestCardTypeWithId = await prisma.cardTemplate.groupBy({
        by: ["cardTypeId"],
        where: {
            kanbanId: kanbanId
        },
        _max: {
            version: true
        }
    })
    const latestCardTypeWithIdFlat = latestCardTypeWithId.flatMap(i => {
        return {
            cardTypeId: i.cardTypeId,
            version: i._max.version as number
        }
    })

    const res = await prisma.cardTemplate.findMany({
        where: {
            OR: latestCardTypeWithIdFlat
        },
        select: {
            id: true,
            name: true,
            isDefault: true,
            cardType: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return NextResponse.json(res)
}

export async function POST(req: Request) {
    const data = await req.json()

    const kanbanId = data.kanbanId
    delete data["kanbanId"]
    const defaultCardId = data.isDefault
    delete data["isDefault"]

    const dataInArray: any = {}
    for (var i in data) {
        const idAndDataType = i.split("-")
        if (!dataInArray.hasOwnProperty(idAndDataType[0])) {
            dataInArray[idAndDataType[0]] = {}
        }
        if (idAndDataType[1] === "card") {
            dataInArray[idAndDataType[0]]["name"] = data[i]
        } else if (idAndDataType[1] === "cardType") {
            // no actual idea what it means to change the card type... -_-
        }
    }

    for (var i in dataInArray) {
        await prisma.cardTemplate.update({
            where: {
                id: parseInt(i),
            },
            data: dataInArray[i],
        })
    }

    return NextResponse.json(1)
}
