import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  let query = "UPDATE "
  if (data.type === "COLUMN") {
    query += "KanbanColumn"
  } else {
    query += "KanbanSwimLane"
  }
  query += " SET `ORDER` = CASE\n"

  for (let i = 0; i < data.headers.length; i++) {
    query += "WHEN id = " + data.headers[i] + " THEN " + (i + 1) + "\n"
  }
  query += "END\nWHERE id IN (" + data.headers.toString() + ");"

  await prisma.$queryRawUnsafe(query) //!! UNSAFE!!

  return NextResponse.json("ok")
}
