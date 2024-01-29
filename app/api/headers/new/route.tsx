import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
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
  } else {
    toUpdate = await prisma.kanbanSwimLane.create({
      data: {
        title: "To be updated",
        order: data.order,
        boardId: data.boardId
      }
    })
  }

  if (toUpdate) {
    return NextResponse.json(toUpdate.id);
  } else {
    return NextResponse.json(-1);
  }
}