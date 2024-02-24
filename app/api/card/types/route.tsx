import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const data = await req.json()

    const a = await prisma.cardTemplate.findMany({
        where: {
            kanbanId: 1
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
