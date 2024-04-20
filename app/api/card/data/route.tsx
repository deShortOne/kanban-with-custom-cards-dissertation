import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const data = await req.json()

    const card = await prisma.card.findUnique({
        where: {
            id: data.id
        },
        select: {
            id: true,
            title: true,
            cardTemplate: {
                select: {
                    cardTypeId: true,
                    tabs: {
                        include: {
                            tabFields: {
                                include: {
                                    fieldType: {
                                        select: {
                                            name: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            allTabsFieldInformation: {
                select: {
                    id: true,
                    cardTemplateTabFieldId: true,
                    data: true,
                }
            }
        }
    })

    return NextResponse.json(card);
}
