import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  if (data.type === "COLUMN") {
    await prisma.kanbanColumn.delete({
      where: {
        id: data.id
      }
    })
  } else {
    await prisma.kanbanSwimLane.delete({
      where: {
        id: data.id
      }
    })
  }

  return NextResponse.json("ok");
}
