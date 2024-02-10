import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const data = await req.json()

    const kanbanId = data.kanbanId
    delete data["kanbanId"]
    const defaultCardId = data.isDefault
    delete data["isDefault"]

    const dataInArray = {}
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
