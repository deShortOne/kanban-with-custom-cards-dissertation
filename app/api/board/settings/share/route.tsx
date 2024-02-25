import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url)
    const kanbanId = parseInt(url.searchParams.get("kanbanId")!)

    const res = await prisma.userRoleKanban.findMany({
        where: {
            kanbanId: kanbanId
        },
        select: {
            user: true,
            permission: true
        }
    })

    return NextResponse.json(res)
}


export async function POST(req: Request) {
    const data = await req.json()

    const kanbanId = data.kanbanId
    delete data["kanbanId"]

    const dataInArray: any = {}
    for (var i in data) {
        const idAndDataType = i.split("~")
        if (!dataInArray.hasOwnProperty(idAndDataType[0])) {
            dataInArray[idAndDataType[0]] = {}
        }

        if (idAndDataType[1] === "useremail") {
            dataInArray[idAndDataType[0]]["email"] = data[i]
        } else if (idAndDataType[1] === "user") {
            dataInArray[idAndDataType[0]]["permission"] = data[i]
        }
    }

    await prisma.userRoleKanban.deleteMany({
        where: {
            kanbanId: kanbanId,
        }
    })

    for (var i in dataInArray) {
        await prisma.userRoleKanban.create({
            data: {
                user: {
                    connect: {
                        email: dataInArray[i].email
                    }
                },
                permission: dataInArray[i].permission,
                kanban: {
                    connect: {
                        id: kanbanId
                    }
                },
            },
        })
    }

    return NextResponse.json(1)
}
