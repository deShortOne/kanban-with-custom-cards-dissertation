import { prisma } from "@/lib/prisma"

export async function updateDb(boardId: number, type: string, headers: number[]) {
    let query = "UPDATE "
    if (type === "COLUMN") {
        query += "KanbanColumn"
    } else {
        query += "KanbanSwimLane"
    }
    query += " SET `ORDER` = CASE\n"

    // create case when statements for updating id to order number
    for (let i = 0; i < headers.length; i++) {
        query += "WHEN id = " + headers[i] + " THEN " + (i + 1) + "\n"
    }
    query += "END\nWHERE id IN (" + headers.toString() + ");"

    await prisma.$queryRawUnsafe(query) //!! UNSAFE!!
}
