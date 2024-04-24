import { FieldProp, FieldTypeProp, Tab } from "@/app/types/CardContents"

export const NullField: FieldTypeProp = {
    id: -1,
    name: "null",
    description: ""
}

export const NewField: FieldProp = {
    data: "Select field",
    posX: 1,
    posY: 1,
    fieldType: NullField
}

export const EmptyTab: Tab = {
    name: "New tab",
    order: -1,
    sizeX: 1,
    sizeY: 1,
    tabFields: [NewField]
}
