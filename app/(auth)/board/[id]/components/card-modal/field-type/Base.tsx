import { UseFormReturn } from "react-hook-form";

export interface FieldTypeProp {
    form: UseFormReturn<{}, any, {}>,
    fieldTypeData: string,
    defaultValues: {},
    name: string
}

export interface CardData {
    "allTabsFieldInformation":
    {
        "cardTemplateTabFieldId": number,
        "data": string,
        "id": number,
    }[],
    "cardTemplate": {
        "cardTypeId": number,
        "tabs":
        {
            "cardTemplateId": number,
            "id": number,
            "name": string,
            "order": number,
            "sizeX": number,
            "sizeY": number,
            "tabFields":
            {
                "cardTemplateTabId": number,
                "fieldType": {
                    "name": string
                },
                "fieldTypeId": number,
                "id": number,
                "data": string,
                "posX": number,
                "posY": number,
            }[]
        }[]
    },
    "description": null,
    "developer": {
        "email": string,
        "id": number,
    },
    "id": number,
    "title": string,
}
