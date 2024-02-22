import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const cardTemplateId = url.searchParams.get("cardTemplateId")!

    const cardTemplate = await prisma.cardTemplate.findFirst({
        where: {
            id: parseInt(cardTemplateId),
        },
        include: {
            tabs: {
                include: {
                    tabFields: {
                        include: {
                            fieldType: true
                        }
                    }
                },
                orderBy: {
                    order: "asc"
                }
            }
        }
    })

    return NextResponse.json(cardTemplate);
}
