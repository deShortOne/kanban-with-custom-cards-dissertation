import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  let toUpdate;
  if (data.type === "COLUMN") {
    toUpdate = await prisma.kanbanColumn.upsert({
      where: {
        id: data.id,
      },
      update: {
        title: data.newText,
      },
      create: {
        title: data.newText,
        order: data.order,
        boardId: data.boardId
      }
    })
  } else {
    toUpdate = await prisma.kanbanSwimLane.upsert({
      where: {
        id: data.id,
      },
      update: {
        title: data.newText,
      },
      create: {
        title: data.newText,
        order: data.order,
        boardId: data.boardId
      }
    })
  }

  if (toUpdate) {
    return NextResponse.json("ok");
  } else {
    return NextResponse.json("fail");
  }
}
