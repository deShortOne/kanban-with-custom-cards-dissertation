
export interface FieldTypeProp {
    id: number
    name: string
    description: string
}
export const NullField: FieldTypeProp = {
    id: -1,
    name: "null",
    description: ""
}

export interface FieldProp {
    data: string
    posX: number
    posY: number
    fieldType: FieldTypeProp
}
export const NewField: FieldProp = {
    data: "Select field",
    posX: 1,
    posY: 1,
    fieldType: NullField
}

export interface Tab {
    name: string
    order: number
    sizeX: number
    sizeY: number
    tabFields: FieldProp[]
}
export const EmptyTab: Tab = {
    name: "New tab",
    order: -1,
    sizeX: 1,
    sizeY: 1,
    tabFields: [NewField]
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
