import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json()

  const cardTemplateMaxVersion = await prisma.cardTemplate.groupBy({
    by: ["cardTypeId"],
    where: {
      cardTypeId: data.cardType,
      kanbanId: data.kanbanId,
    },
    _max: {
      version: true,
    }
  })

  if (!cardTemplateMaxVersion[0]._max.version) {
    return NextResponse.json(-1)
  }

  const cardTemplate = await prisma.cardTemplate.findFirst({
    where: {
      cardTypeId: data.cardType,
      kanbanId: data.boardId,
      version: cardTemplateMaxVersion[0]._max.version
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
      cardTemplateId: 1,
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
