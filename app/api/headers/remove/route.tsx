import prisma from "@/lib/prisma"
import { Kanban, KanbanColumn, KanbanSwimLane } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req, res) {
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
    fetch('/api/headers/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        boardId: data.boardId,
        type: "COLUMN",
        headers: kanbanColumns.map(col => col.id)
      }),
    })

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
    fetch('/api/headers/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        boardId: data.boardId,
        type: "SWIMLANE",
        headers: kanbanSwimLanes.map(lane => lane.id)
      }),
    })
  }



  return NextResponse.json("ok")
}
