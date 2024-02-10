import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  const data = await request.json()

  const res = await prisma.userRoleKanban.findMany({
    where: {
      kanbanId: data.kanbanId
    },
    select: {
      user: true,
      permission: true
    }
  })

  return NextResponse.json(res)
}
