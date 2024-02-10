import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const data = await req.json()

    const kanbanId = data.kanbanId
    delete data["kanbanId"]

    const dataInArray = {}
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
