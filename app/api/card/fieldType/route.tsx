import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const fieldType = await prisma.fieldType.findMany({
        where: {
            implemented: true,
        },
    })

    return NextResponse.json(fieldType);
}
