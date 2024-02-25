import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const kanbanId = parseInt(url.searchParams.get("kanbanId")!)

    const cardTypeAndVersion = await prisma.cardTemplate.groupBy({
        where: {
            kanbanId: kanbanId
        },
        _max: {
            version: true
        },
        by: ["cardTypeId"]
    })

    const cardTypeAndVersionFlat = cardTypeAndVersion.map(i => (
        { cardTypeId: i.cardTypeId, version: i._max.version }
    )) as { cardTypeId: number, version: number }[]

    const latestCardTemplates = await prisma.cardTemplate.findMany({
        where: {
            OR: cardTypeAndVersionFlat
        },
        select: {
            id: true,
            name: true,
            isDefault: true,
            cardType: {
                select: {
                    name: true,
                },
            },
        },
        distinct: ["cardTypeId"],
    })

    return NextResponse.json(latestCardTemplates);
}
