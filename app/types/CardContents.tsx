export interface FieldTypeProp {
    id: number
    name: string
    description: string
}

export interface FieldProp {
    data: string
    posX: number
    posY: number
    fieldType: FieldTypeProp
}

export interface Tab {
    name: string
    order: number
    sizeX: number
    sizeY: number
    tabFields: FieldProp[]
}

export interface DataProp {
    id: number
    name: string
    tabs: Tab[]
    cardTypeId: number
}

export interface CardType {
    id: number
    name: string
    cardTemplateId: number
}

export interface CardData {
    id: number,
    title: string,

    allTabsFieldInformation: {
        id: number,
        data: string,
        cardTemplateTabFieldId: number,
    }[],
    cardTemplate: {
        cardTypeId: number,
        tabs: {
            cardTemplateId: number,
            id: number,
            name: string,
            order: number,
            sizeX: number,
            sizeY: number,
            tabFields: {
                cardTemplateTabId: number,
                fieldType: {
                    name: string
                },
                fieldTypeId: number,
                id: number,
                data: string,
                posX: number,
                posY: number,
            }[]
        }[]
    },
}
