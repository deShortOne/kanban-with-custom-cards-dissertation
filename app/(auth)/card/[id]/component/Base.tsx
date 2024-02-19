
export interface DataProp {
    id: number,
    name: string,
    tabs: {
        name: string,
        order: number,
        sizeX: number,
        sizeY: number,
        tabFields: {
            data: string,
            posX: number,
            posY: number,
            fieldType: {
                id: number,
                name: string,
                description: string,
            },
        }[],
    }[],
}

export interface FieldTypeProp {
    id: number,
    name: string,
    description: string,
}
