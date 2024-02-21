"use client"

import { useEffect, useState } from "react"
import { SideBar } from "./component/SideBar"
import { DataProp, FieldTypeProp } from "./component/Base"
import { CardContent } from "./component/CardContent"

const SelectKanbanPage = ({
    params
}: {
    params: { id: string }
}) => {
    const [data, setData] = useState<DataProp>()
    const [fieldType, setFieldType] = useState<FieldTypeProp[]>()
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

            const nullField = {
                id: -1,
                name: "null",
                description: ""
            }

            dataField.unshift(nullField)

            dataTemplate.tabs.forEach(tab => {
                for (let x = 1; x <= tab.sizeX; x++) {
                    for (let y = 1; y <= tab.sizeY; y++) {
                        const field = tab.tabFields.find(i => i.posX === x && i.posY === y)
                        if (!field) {
                            tab.tabFields.push({
                                data: "Select field",
                                posX: x,
                                posY: y,
                                fieldType: JSON.parse(JSON.stringify(nullField))
                            })
                        }
                    }
                }
            })

            console.log(dataField)

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
            <SideBar />
            <CardContent
                allFieldTypes={fieldType as FieldTypeProp[]}
                cardData={data as DataProp}
                setData={setData}
            />
        </main>
    )
}

export default SelectKanbanPage;
