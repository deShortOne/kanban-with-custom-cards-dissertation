
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
}
