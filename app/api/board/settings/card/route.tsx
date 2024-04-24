import { insertUpdateCardTemplates } from "@/app/api/commonFunctions/Base";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url)
    const kanbanId = parseInt(url.searchParams.get("kanbanId")!)

    const latestCardTypeWithId = await prisma.cardTemplate.groupBy({
        by: ["cardTypeId"],
        where: {
            kanbanId: kanbanId
        },
        _max: {
            version: true
        }
    })

    const latestCardTypeWithIdFlat = latestCardTypeWithId.flatMap(i => {
        return {
            kanbanId: kanbanId,
            cardTypeId: i.cardTypeId,
            version: i._max.version as number
        }
    })

    const res = await prisma.cardTemplate.findMany({
        where: {
            OR: latestCardTypeWithIdFlat
        },
        select: {
            id: true,
            name: true,
            cardType: {
                select: {
                    id: true,
                    name: true,
                }
            },
            activeCardTypes: {
                select: {
                    isDefault: true
                }
            }
        }
    })

    return NextResponse.json(res)
}

export async function POST(req: Request) {
    const data = await req.json()

    const kanbanId = parseInt(data.kanbanId)
    const defaultCardId = parseInt(data.isDefault)

    await prisma.activeCardTypes.updateMany({
        where: {
            kanbanId: kanbanId
        },
        data: {
            isDefault: false
        }
    })

    await prisma.activeCardTypes.update({
        where: {
            cardTypeId_kanbanId: {
                cardTypeId: defaultCardId,
                kanbanId: kanbanId,
            }
        },
        data: {
            isDefault: true
        }
    })

    insertUpdateCardTemplates(data.kanbanId)

    return NextResponse.json(1)
}
