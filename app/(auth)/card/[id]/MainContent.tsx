"use client"

import { useState } from "react"
import { SideBar } from "./component/SideBar"
import { CardType, DataProp, FieldTypeProp } from "./component/Base"
import { CardContent } from "./component/CardContent"

interface props {
    cardTemplate: DataProp
    fieldTypes: FieldTypeProp[]
    cardTypes: CardType[]
}

const UpdateCardMain = ({
    cardTemplate, fieldTypes, cardTypes
}: props) => {

    const [data, setData] = useState<DataProp>(cardTemplate)
    const [currentTabIdx, setCurrentTabIdx] = useState<number>(0)
    const [mode, setMode] = useState<"Card contents" | "Card display">()

    const saveDataToDB = async () => {
        const response = await fetch('/api/card/template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.redirected) {
            window.location.href = response.url
        }
    }

    return (
        <main className="min-h-[90vh] flex">
            <SideBar
                cardData={data as DataProp}
                setData={setData}
                tabIdx={currentTabIdx}
                setCurrentTabIdx={setCurrentTabIdx}
                saveDataToDB={saveDataToDB}
                cardTypes={cardTypes}
            />
            <CardContent
                allFieldTypes={fieldTypes}
                cardData={data as DataProp}
                setData={setData}
                currTabIdx={currentTabIdx}
                setCurrentTabIdx={setCurrentTabIdx}
            />
        </main>
    )
}

export default UpdateCardMain;
