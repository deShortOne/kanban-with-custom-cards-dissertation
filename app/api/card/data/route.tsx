import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req, res) {
  const data = await req.json()

  const aa = await prisma.card.findUnique({
    where: {
      id: data.id
    },
    select: {
      id: true,
      title: true,
      developer: true,
      description: true,
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

  return NextResponse.json(aa);
}