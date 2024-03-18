import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { insertUpdateColumnPositions, insertUpdateSwimLanePositions } from "../../commonFunctions/Base";

export async function POST(req: Request) {
    const data = await req.json()

    let toUpdate;
    if (data.type === "COLUMN") {
        toUpdate = await prisma.kanbanColumn.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.newText,
            },
        })
        insertUpdateColumnPositions(toUpdate.boardId)
    } else {
        toUpdate = await prisma.kanbanSwimLane.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.newText,
            },
        })
        insertUpdateSwimLanePositions(toUpdate.boardId)
    }

    if (toUpdate) {
        return NextResponse.json("ok");
    } else {
        return NextResponse.json("fail");
    }
}
