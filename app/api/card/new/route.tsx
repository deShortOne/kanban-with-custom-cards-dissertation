import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json()

  const cardTemplate = await prisma.cardTemplate.findFirst({
    where: {
      id: data.cardTemplateId
    },
    include: {
      tabs: {
        include: {
          tabFields: true
        }
      }
    }
  })

  if (!cardTemplate) {
    return NextResponse.json(-1)
  }

  const toUpdate = await prisma.card.create({
    data: {
      title: "To be updated",
      order: data.order,
      description: null,
      columnId: -1,
      swimLaneId: -1,
      kanbanId: data.boardId,
      cardTemplateId: data.cardTemplateId,
    },
  })

  const tabFieldData: { cardId: number, data: string, cardTemplateTabFieldId: number }[] = []
  for (let i = 0; i < cardTemplate.tabs.length; i++) {
    for (let j = 0; j < cardTemplate.tabs[i].tabFields.length; j++) {
      tabFieldData.push(
        {
          cardId: toUpdate.id,
          data: "",
          cardTemplateTabFieldId: cardTemplate.tabs[i].tabFields[j].id,
        }
      )
    }
  }

  await prisma.cardTabField.createMany({
    data: tabFieldData,
  })


  if (toUpdate) {
    return NextResponse.json(toUpdate.id);
  } else {
    return NextResponse.json(-1);
  }
}
