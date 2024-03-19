import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { insertUpdateCardPositions } from "../../commonFunctions/Base";

export async function POST(req: Request) {
    const data = await req.json()

    await prisma.card.delete({
        where: {
            id: data.cardId,
        }
    })

    insertUpdateCardPositions(data.boardId)

    return NextResponse.json(1)
}
