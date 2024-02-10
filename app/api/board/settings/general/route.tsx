import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const data = await req.json()

    const toUpdate = await prisma.kanban.update({
        where: {
            id: data.kanbanId,
        },
        data: {
            title: data.kanbanName,
        },
    })


    return NextResponse.json(1)
}
