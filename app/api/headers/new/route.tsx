import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { insertUpdateColumnPositions, insertUpdateSwimLanePositions } from "../../commonFunctions/Base";

export async function POST(req: Request) {
    const data = await req.json()

    let toUpdate;
    if (data.type === "COLUMN") {
        toUpdate = await prisma.kanbanColumn.create({
            data: {
                title: "To be updated",
                order: data.order,
                boardId: data.boardId
            }
        })
        insertUpdateColumnPositions(toUpdate.boardId)
    } else {
        toUpdate = await prisma.kanbanSwimLane.create({
            data: {
                title: "To be updated",
                order: data.order,
                boardId: data.boardId
            }
        })
        insertUpdateSwimLanePositions(toUpdate.boardId)
    }

    if (toUpdate) {
        return NextResponse.json(toUpdate.id);
    } else {
        return NextResponse.json(-1);
    }
}
