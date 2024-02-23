import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const fieldType = await prisma.fieldType.findMany({
        where: {
            implemented: true,
        },
    })

    return NextResponse.json(fieldType);
}
