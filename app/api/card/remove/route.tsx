import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json()

  await prisma.card.delete({
    where: {
      id: data.cardId,
    }
  })

  return NextResponse.json(1)
}
