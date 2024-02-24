import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const kanbanId = url.searchParams.get("kanbanId")!

    const a = await prisma.cardTemplate.findMany({
        where: {
            kanbanId: parseInt(kanbanId)
        },
        select: {
            cardType: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        distinct: ["cardTypeId"],
    })

    return NextResponse.json(a.flatMap(i => i.cardType));
}
