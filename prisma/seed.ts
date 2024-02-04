import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const person = await prisma.user.create({
        data: { email: 'jingshianggu@gmail.com' }
    })

    const kanban = await prisma.kanban.create({
        data: { title: 'kanban board 1' }
    })

    const userRoleKanban = await prisma.userRoleKanban.create({
        data: {
            userId: person.id,
            kanbanId: kanban.id,
            permission: Role.EDITOR
        }
    })

    const kanbanColumnsData = [
        { title: 'column 1', order: 1, boardId: kanban.id },
        { title: 'column 2 - empty', order: 2, boardId: kanban.id },
    ]
    const kanbanColumns = await prisma.kanbanColumn.createMany({
        data: kanbanColumnsData,
        skipDuplicates: true,
    })
    console.log("All columns added: ", kanbanColumnsData.length == kanbanColumns.count)

    const kanbanSwimLanesData = [
        { title: 'swim lane 1 - empty', order: 1, boardId: kanban.id },
        { title: 'swim lane 2', order: 2, boardId: kanban.id },
    ]
    const kanbanSwimLanes = await prisma.kanbanSwimLane.createMany({
        data: kanbanSwimLanesData,
        skipDuplicates: true,
    })
    console.log("All swim lanes added: ", kanbanSwimLanesData.length == kanbanSwimLanes.count)

    const fieldTypeData = [
        { name: 'Text field' },
        { name: 'Text area' },
        { name: 'Date picker' },
        { name: 'Comment' },
        { name: 'File upload' },
        { name: 'Check boxes' },
        { name: 'Drop down' },
        { name: 'Track Github branch' },
    ]
    const fieldTypes = await prisma.fieldType.createMany({
        data: fieldTypeData,
        skipDuplicates: true,
    })
    console.log("Field types added: ", fieldTypeData.length == fieldTypes.count)

    const cardTypeData = [
        { name: 'task' },
        { name: 'bug' },
    ]
    const cardType = await prisma.cardType.createMany({
        data: cardTypeData,
        skipDuplicates: true,
    })
    console.log("Card type added: ", cardTypeData.length == cardType.count)

    const cardTemplateData = [
        {
            cardTypeId: 1,
            version: 1,
        }
    ]
    const cardTemplate = await prisma.cardTemplate.createMany({
        data: cardTemplateData,
        skipDuplicates: true,
    })
    console.log("Card template added: ", cardTemplateData.length == cardTemplate.count)

    const cardTemplateTabData = [
        {
            name: 'tab1',
            order: 1,
            cardTemplateId: 1,
            sizeX: 1,
            sizeY: 2,
        }
    ]
    const cardTemplateTab = await prisma.cardTemplateTab.createMany({
        data: cardTemplateTabData,
        skipDuplicates: true,
    })
    console.log("Card template tab added: ", cardTemplateTabData.length == cardTemplateTab.count)

    const cardTemplateTabFieldData = [
        {
            data: "Single line label",
            posX: 1,
            posY: 1,
            cardTemplateTabId: 1,
            fieldTypeId: 1,
        },
        {
            data: "Multiline label",
            posX: 1,
            posY: 2,
            cardTemplateTabId: 1,
            fieldTypeId: 2,
        },
    ]
    const cardTemplateTabField = await prisma.cardTemplateTabField.createMany({
        data: cardTemplateTabFieldData,
        skipDuplicates: true,
    })
    console.log("Card template tab field added: ", cardTemplateTabFieldData.length == cardTemplateTabField.count)

    const cardsData = [
        {
            title: 'card 1 2',
            order: 1,
            developerId: 1,
            columnId: 1,
            swimLaneId: 2,
            kanbanId: 1,
            cardTemplateId: 1,
        },
        {
            title: 'card 2 1',
            order: 1,
            developerId: null,
            columnId: 2,
            swimLaneId: 1,
            kanbanId: 1,
            cardTemplateId: 1,
        },
    ]
    const cards = await prisma.card.createMany({
        data: cardsData,
        skipDuplicates: true,
    })
    console.log("All cards added: ", cardsData.length == cards.count)

    const cardTabFieldData = [
        {
            data: 'Text in single line input',
            cardId: 1,
            cardTemplateTabFieldId: 1
        },
        {
            data: 'Something super duper long that will be in the multiline text area input',
            cardId: 1,
            cardTemplateTabFieldId: 2
        },
    ]
    const cardTabField = await prisma.cardTabField.createMany({
        data: cardTabFieldData,
        skipDuplicates: true,
    })
    console.log("Card template tab field added: ", cardTabFieldData.length == cardTabField.count)
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
