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
            const dataTemplate = await getCardTemplate()
            const dataField = await getFieldTypes()

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
            <CardContent allFieldTypes={fieldType as FieldTypeProp[]} cardData={data as DataProp} />
        </main>
    )
}

export default SelectKanbanPage;
