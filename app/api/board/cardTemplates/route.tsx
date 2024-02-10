import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  const data = await request.json()

  const latestCardTypeWithId = await prisma.cardTemplate.groupBy({
    by: ["cardTypeId"],
    where: {
      kanbanId: parseInt(data["kanbanId"])
    },
    _max: {
      version: true
    }
  })
  const latestCardTypeWithIdFlat = latestCardTypeWithId.flatMap(i => {
    return {
      cardTypeId: i.cardTypeId,
      version: i._max.version
    }
  })

  const res = await prisma.cardTemplate.findMany({
    where: {
      OR: latestCardTypeWithIdFlat
    },
    select: {
      id: true,
      name: true,
      isDefault: true,
      cardType: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return NextResponse.json(res)
}
