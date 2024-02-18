import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  console.log(data.cardId)

  await prisma.card.delete({
    where: {
      id: data.cardId,
    }
  })

  return NextResponse.json(1)
}
