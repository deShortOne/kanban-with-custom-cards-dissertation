import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
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
  } else {
    toUpdate = await prisma.kanbanSwimLane.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.newText,
      },
    })
  }

  if (toUpdate) {
    return NextResponse.json("ok");
  } else {
    return NextResponse.json("fail");
  }
}
