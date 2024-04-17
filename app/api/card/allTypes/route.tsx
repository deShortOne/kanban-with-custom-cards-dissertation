import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        return NextResponse.json(await prisma.cardType.findMany())
    } catch {
        return NextResponse.error()
    }
}

export async function POST(req: Request) {
    const data = await req.json()

    // TODO

    return NextResponse.json(1)
}
