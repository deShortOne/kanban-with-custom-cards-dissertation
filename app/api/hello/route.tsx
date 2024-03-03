import { OPTIONS } from "@/utils/authOptions"
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'

export async function GET() {
    const session = await getServerSession(OPTIONS);
    return NextResponse.json(session);
}


