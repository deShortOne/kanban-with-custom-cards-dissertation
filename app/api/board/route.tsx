import { PrismaClient, Role, User } from "@prisma/client"
import { getServerSession } from 'next-auth/next'
import { OPTIONS } from '@/app/api/auth/[...nextauth]/route'
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const formData = await request.formData()

  const kanban = await prisma.kanban.create({
    data: {
      title: formData.get("name") as string
    }
  })

  const id = await getUserId();
  if (id == -1) {
    return Response.json({ status: false })
  }
  
  await prisma.userRoleKanban.create({
    data: {
      userId: id,
      kanbanId: kanban.id,
      permission: Role.EDITOR
    }
  })

  return Response.json({ kanban })
}

async function getUserId() {
  // ideally I should be pulling from an api, but I couldn't get it to work
  const session = await getServerSession(OPTIONS);
  if (!session || !session.user) {
    return -1
  }
  const user = await prisma.user.findUniqueOrThrow({
      where: {
          email: session.user.email as string
      }
  })
  return user.id
}
