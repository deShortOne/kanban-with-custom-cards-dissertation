"use client"

import { useState } from "react"
import { SideBar } from "./component/SideBar"
import { CardType, DataProp, FieldTypeProp } from "@/app/types/CardContents"
import { CardContent } from "./component/CardContent"

export interface CardEditCommonProps {
    cardData: DataProp
    setData: (newData: DataProp) => void
}

interface props {
    cardTemplate: DataProp
    fieldTypes: FieldTypeProp[]
    cardTypes: CardType[]
    kanbanId: number
    initialCardTypeId: number
}

const UpdateCardMain = ({
    initialCardTypeId, cardTemplate, fieldTypes, cardTypes, kanbanId
}: props) => {

    const [data, setData] = useState<DataProp>(cardTemplate)
    const [currentTabIdx, setCurrentTabIdx] = useState<number>(0)
    const [availableCardTypes, setAvailableCardTypes] = useState(cardTypes)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [mode, setMode] = useState<"Card contents" | "Card display">()

    const setDataAndSetUnsaved = (newData: DataProp) => {
        setData(newData)
        setHasUnsavedChanges(true)
    }

    const saveDataToDB = async () => {
        setHasUnsavedChanges(false)
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
                setData={setDataAndSetUnsaved}
                tabIdx={currentTabIdx}
                setCurrentTabIdx={setCurrentTabIdx}
                saveDataToDB={saveDataToDB}
                cardTypes={availableCardTypes}
                setCardTypes={setAvailableCardTypes}
                kanbanId={kanbanId}
                initialCardTypeId={initialCardTypeId}
            />
            <CardContent
                allFieldTypes={fieldTypes}
                cardData={data as DataProp}
                setData={setDataAndSetUnsaved}
                currTabIdx={currentTabIdx}
                setCurrentTabIdx={setCurrentTabIdx}
            />
        </main>
    )
}

export default UpdateCardMain;
