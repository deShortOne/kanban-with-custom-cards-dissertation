import { OPTIONS } from '../auth/[...nextauth]/route'
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(OPTIONS);

    if (!session || !session.user) {
        return new Response('user doesn\'t exist in database', {
            status: 500,
        })
    }

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            githubId: session.user.id
        }
    })

    // the response is something I don't know how to unpack!!
    return NextResponse.json({ message: user.id });
}
