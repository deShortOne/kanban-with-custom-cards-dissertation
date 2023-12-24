import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const person = await prisma.user.create({
        data: {email: 'jingshianggu@gmail.com'}
    })

    
    const kanban = await prisma.kanban.create({
        data: {title: 'kanban board 1'}
    })

    const userRoleKanban = await prisma.userRoleKanban.create({
        data: {
            userId: person.id,
            kanbanId: kanban.id,
            permission: Role.EDITOR
        }
    })

    const kanbanColumnsData = [
        {title: 'column 1', order: 1, boardId: kanban.id},
        {title: 'column 2 - empty', order: 2, boardId: kanban.id},
    ]
    const kanbanColumns = await prisma.kanbanColumn.createMany({
        data: kanbanColumnsData,
        skipDuplicates: true,
    })
    console.log("All columns added: ", kanbanColumnsData.length == kanbanColumns.count)

    const kanbanSwimLanesData = [
        {title: 'swim lane 1 - empty', order: 1, boardId: kanban.id},
        {title: 'swim lane 2', order: 2, boardId: kanban.id},
    ]
    const kanbanSwimLanes = await prisma.kanbanSwimLane.createMany({
        data: kanbanSwimLanesData,
        skipDuplicates: true,
    })
    console.log("All swim lanes added: ", kanbanSwimLanesData.length == kanbanSwimLanes.count)

    const cardsData = [
        {
            title: 'card 1 2', 
            order: 1, 
            columnId: 0, // yikes constant!
            swimLaneId: 1, // yikes constant!
        },
        {
            title: 'card 2, 1', 
            order: 1, 
            columnId: 1, // yikes constant!
            swimLaneId: 0, // yikes constant!
        },
    ]
    const cards = await prisma.card.createMany({
        data: cardsData,
        skipDuplicates: true,
    })
    console.log("All cards added: ", cardsData.length == cards.count)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })