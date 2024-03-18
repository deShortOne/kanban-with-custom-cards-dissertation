import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { insertUpdateCardPositions } from "../../commonFunctions/Base";

interface updateCardDisplay {
    id: number,
    title: string,
    columnId: number
    swimLaneId: number,
    order: number,
}

export async function POST(req: Request) {
    const data = (await req.json()).cardList as updateCardDisplay[]
    const dataLoadToDb = []

    for (let i = 0; i < data.length; i++) {
        dataLoadToDb.push(
            prisma.card.update({
                where: {
                    id: data[i].id,
                },
                data: {
                    title: data[i].title,
                    columnId: data[i].columnId,
                    swimLaneId: data[i].swimLaneId,
                    order: data[i].order,
                },
            })
        )

    }

    Promise.all(dataLoadToDb)

    insertUpdateCardPositions((await dataLoadToDb[0]).kanbanId)

    return new NextResponse("ok")
}
