import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  console.log(data)

//   await prisma.card.update({
//     where: {
//       id: data.id,
//     },
//     data: {
//       title: data.title,
//       columnId: data.columnId,
//       swimLaneId: data.swimLaneId,
//     },
//   })

  return new NextResponse("ok")
}
