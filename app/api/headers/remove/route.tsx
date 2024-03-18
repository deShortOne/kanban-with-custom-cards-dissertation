import { prisma } from "@/lib/prisma"
import { KanbanColumn, KanbanSwimLane } from "@prisma/client"
import { NextResponse } from "next/server"
import { insertUpdateColumnPositions, insertUpdateSwimLanePositions } from "../../commonFunctions/Base"
import { updateDb } from "../reorder/route" // TODO don't like this name

export async function POST(req: Request) {
    const data = await req.json()

    if (data.type === "COLUMN") {
        await prisma.kanbanColumn.delete({
            where: {
                id: data.id
            }
        })

        let kanbanColumns = await prisma.kanbanColumn.findMany({
            where: {
                boardId: data.boardId
            }
        }) as KanbanColumn[]

        updateDb(kanbanColumns[0].boardId, "COLUMN", kanbanColumns.map(col => col.id))
        insertUpdateColumnPositions(kanbanColumns[0].boardId)
    } else {
        await prisma.kanbanSwimLane.delete({
            where: {
                id: data.id
            }
        })

        let kanbanSwimLanes = await prisma.kanbanSwimLane.findMany({
            where: {
                boardId: data.boardId
            }
        }) as KanbanSwimLane[]

        updateDb(kanbanSwimLanes[0].boardId, "SWIMLANE", kanbanSwimLanes.map(lane => lane.id))
        insertUpdateSwimLanePositions(kanbanSwimLanes[0].boardId)
    }

    return NextResponse.json("ok")
}
