import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = (await req.json()).card

  await prisma.card.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      columnId: data.columnId,
      swimLaneId: data.swimLaneId,
    },
  })

  return new NextResponse("ok")
}
