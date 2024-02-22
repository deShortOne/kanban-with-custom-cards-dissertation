"use client"

import { useEffect, useState } from "react"
import { SideBar } from "./component/SideBar"
import { DataProp, FieldTypeProp } from "./component/Base"
import { CardContent } from "./component/CardContent"

export const nullField = {
    id: -1,
    name: "null",
    description: ""
}

export const newField = {
    data: "Select field",
    posX: -1,
    posY: -1,
    fieldType: nullField
}

const SelectKanbanPage = ({
    params
}: {
    params: { id: string }
}) => {
    const [data, setData] = useState<DataProp>()
    const [fieldType, setFieldType] = useState<FieldTypeProp[]>()
    const [currentTabIdx, setCurrentTabIdx] = useState<number>(0)
    const [isLoading, setLoading] = useState(true)
    const [mode, setMode] = useState<"Card contents" | "Card display">();

    useEffect(() => {
        const getCardTemplate = async () => {
            const response = await fetch('/api/card/template?'
                + new URLSearchParams({
                    cardTemplateId: params.id,
                }), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return await response.json()
        }

        const getFieldTypes = async () => {
            const response = await fetch('/api/card/fieldType', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return await response.json()
        }

        const fetchBoth = async () => {
            const dataTemplate = await getCardTemplate() as DataProp
            const dataField = await getFieldTypes() as FieldTypeProp[]


            dataField.unshift(nullField)

            dataTemplate.tabs.forEach(tab => {
                for (let x = 1; x <= tab.sizeX; x++) {
                    for (let y = 1; y <= tab.sizeY; y++) {
                        const field = tab.tabFields.find(i => i.posX === x && i.posY === y)
                        if (!field) {
                            tab.tabFields.push({
                                ...newField,
                                posX: x,
                                posY: y,
                            })
                        }
                    }
                }
            })

            setData(dataTemplate)
            setFieldType(dataField)
            setLoading(false)
        }

        fetchBoth()
    }, [])

    if (isLoading)
        return <p>Loading</p>

    return (
        <main className="min-h-[95vh] flex">
            <SideBar
                cardData={data as DataProp}
                setData={setData}
                nullField={newField}
                tabIdx={currentTabIdx}
                setCurrentTabIdx={setCurrentTabIdx}
            />
            <CardContent
                allFieldTypes={fieldType as FieldTypeProp[]}
                cardData={data as DataProp}
                setData={setData}
                currTabIdx={currentTabIdx}
                setCurrentTabIdx={setCurrentTabIdx}
            />
        </main>
    )
}

export default SelectKanbanPage;
