import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";

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
            name: "Task card 1",
            cardTypeId: 1,
            version: 1,
            kanbanId: 1,
        },
        {
            name: "Bug card 1",
            cardTypeId: 2,
            version: 1,
            kanbanId: 1,
        },
        {
            name: "Task card 1.1",
            isDefault: true,
            cardTypeId: 1,
            version: 2,
            kanbanId: 1,
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
        },
        {
            name: 'tab1 for card 2',
            order: 1,
            cardTemplateId: 2,
            sizeX: 1,
            sizeY: 3,
        },
        {
            name: 'tab2 for card 2 - bug',
            order: 2,
            cardTemplateId: 2,
            sizeX: 3,
            sizeY: 3,
        },
        {
            name: 'tab1 for card 1.1',
            order: 1,
            cardTemplateId: 3,
            sizeX: 1,
            sizeY: 1,
        },

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
        {
            data: "Datepicker label;",
            posX: 1,
            posY: 1,
            cardTemplateTabId: 2,
            fieldTypeId: 3,
        },
        {
            data: "Checkboxes label;key1:value1,key2:value2,key 3:value 3",
            posX: 1,
            posY: 2,
            cardTemplateTabId: 2,
            fieldTypeId: 6,
        },
        {
            data: "Drop down label;drop1:value,drop2:value2,drop 3:value 3",
            posX: 1,
            posY: 3,
            cardTemplateTabId: 2,
            fieldTypeId: 7,
        },
        {
            data: "Severity;1:critical,2:major,3:minor",
            posX: 1,
            posY: 1,
            cardTemplateTabId: 3,
            fieldTypeId: 7,
        },
        {
            data: "Affected areas;1:dev,2:staging,3:production",
            posX: 2,
            posY: 1,
            cardTemplateTabId: 3,
            fieldTypeId: 6,
        },
        {
            data: "Deadline;",
            posX: 3,
            posY: 1,
            cardTemplateTabId: 3,
            fieldTypeId: 3,
        },
        {
            data: "Client name",
            posX: 1,
            posY: 2,
            cardTemplateTabId: 3,
            fieldTypeId: 1,
        },
        {
            data: "Client contact information",
            posX: 1,
            posY: 3,
            cardTemplateTabId: 3,
            fieldTypeId: 2,
        },
        {
            data: "Description of bug",
            posX: 2,
            posY: 2,
            cardTemplateTabId: 3,
            fieldTypeId: 1,
        },
        {
            data: "Steps to reproduce bug, expected and actual results",
            posX: 2,
            posY: 3,
            cardTemplateTabId: 3,
            fieldTypeId: 2,
        },
        {
            data: "GitHub Branch Tracker",
            posX: 1,
            posY: 1,
            cardTemplateTabId: 4,
            fieldTypeId: 8,
        }
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
            cardTemplateId: 2,
        },
        {
            title: 'card github repo',
            order: 1,
            developerId: null,
            columnId: 1,
            swimLaneId: 1,
            kanbanId: 1,
            cardTemplateId: 3,
        },
    ]
    const cards = await prisma.card.createMany({
        data: cardsData,
        skipDuplicates: true,
    })
    console.log("All cards added: ", cardsData.length == cards.count)

    const cardTabFieldData = [
        {
            data: 'Something super duper long that will be in the multiline text area input',
            cardId: 1,
            cardTemplateTabFieldId: 2
        },
        {
            data: 'Text in single line input',
            cardId: 1,
            cardTemplateTabFieldId: 1
        },
        {
            data: '3/2/2024',
            cardId: 2,
            cardTemplateTabFieldId: 3
        },
        {
            data: 'key1,key 3',
            cardId: 2,
            cardTemplateTabFieldId: 4
        },
        {
            data: 'drop 3',
            cardId: 2,
            cardTemplateTabFieldId: 5
        },
        {
            data: '1',
            cardId: 2,
            cardTemplateTabFieldId: 6
        },
        {
            data: '1,2,3',
            cardId: 2,
            cardTemplateTabFieldId: 7
        },
        {
            data: '4/26/2024',
            cardId: 2,
            cardTemplateTabFieldId: 8
        },
        {
            data: 'J',
            cardId: 2,
            cardTemplateTabFieldId: 9
        },
        {
            data: 'email: jingshianggu@',
            cardId: 2,
            cardTemplateTabFieldId: 10
        },
        {
            data: 'Dissertation',
            cardId: 2,
            cardTemplateTabFieldId: 11
        },
        {
            data: 'Dissertation, something v v long',
            cardId: 2,
            cardTemplateTabFieldId: 12
        },
        {
            data: 'prac-diss-project;Feat1:1,Feat2:2,Feat3:3,Feat4:4,Feat5:5,Feat6:6,Feat7:7',
            cardId: 3,
            cardTemplateTabFieldId: 13
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
