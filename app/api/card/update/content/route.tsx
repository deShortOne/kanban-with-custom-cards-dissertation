import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  console.log(data)

  let cardId = -1
  let newTitle = ""

  let query = "UPDATE CardTabField SET `data` = CASE\n"
  let lisId: number[] = []

  Object.entries(data).forEach(([a, b]) => {
    if (a.substring(0, 5) === "title") {
      cardId = parseInt(a.substring(5))
      newTitle = data[a]
    } else {
      const id = parseInt(a.substring(1))
      query += "WHEN id = " + id + " THEN '" + b + "'\n"
      lisId.push(id)
    }
  })

  query += "END\nWHERE id IN (" + lisId.toString() + ");"

  if (cardId !== -1 && newTitle !== "") {
    await prisma.$queryRawUnsafe(query)

    await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        title: newTitle,
      },
    })
    return new NextResponse("ok")
  }

  return new NextResponse("not ok")
}
