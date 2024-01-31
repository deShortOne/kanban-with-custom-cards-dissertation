import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  let toUpdate = await prisma.card.create({
    data: {
      title: "To be updated",
      order: data.order,
      description: null,
      columnId: -1,
      swimLaneId: -1,
      kanbanId: data.boardId,
    }
  })

  if (toUpdate) {
    return NextResponse.json(toUpdate.id);
  } else {
    return NextResponse.json(-1);
  }
}
