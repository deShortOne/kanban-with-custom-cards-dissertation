import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface prop {
  boardId: number,
  type: string,
  headers: number[],
  lastUpdate: Date,
}

const lis:prop[] = [];

export async function POST(req, res) {
  const data = await req.json()

  updateValues(data.boardId, data.type, data.headers)
  
  return NextResponse.json("ok")
}

function updateValues(boardId:number, type:string, headers:number[]) {
  let objIdx = lis.findIndex(obj => obj.boardId == boardId && obj.type == type)

  if (objIdx == -1) {
    lis.push({
      boardId: boardId,
      type: type,
      headers: headers,
      lastUpdate: new Date()
    })
    setTimeout( function() { attemptToUpdateDb(boardId, type)}, 2000);
  } else {
    lis[objIdx].headers = headers
    lis[objIdx].lastUpdate = new Date()
  }
}

function attemptToUpdateDb(boardId:number, type:string) {
  let objIdx = lis.findIndex(obj => obj.boardId == boardId && obj.type == type)
  if (objIdx === -1) {
    return
  }

  const object = lis[objIdx]
  if ((new Date()).getTime() - object.lastUpdate.getTime() > 1900) {
    lis.splice(objIdx, 1)

    let query = "UPDATE "
    if (type === "COLUMN") {
      query += "KanbanColumn"
    } else {
      query += "KanbanSwimLane"
    }
    query += " SET `ORDER` = CASE\n"

    // create case when statements for updating id to order number
    const headers = object.headers
    for (let i = 0; i < headers.length; i++) {
      query += "WHEN id = " + headers[i] + " THEN " + (i + 1) + "\n"
    }
    query += "END\nWHERE id IN (" + headers.toString() + ");"
  
    prisma.$queryRawUnsafe(query) //!! UNSAFE!!
  } else {
    setTimeout( function() { attemptToUpdateDb(boardId, type)}, 2000);
  }
}
