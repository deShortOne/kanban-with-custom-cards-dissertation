"use client"

import update from 'immutability-helper'

import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp } from "lucide-react"
import { DataProp, FieldProp } from "./Base"
import { Dispatch, SetStateAction } from "react"

interface prop {
    tabIdx: number
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp | undefined>>
    nullField: FieldProp
}

export const SideBar = ({ cardData, setData, tabIdx, nullField }: prop) => {

    const updateNumber = (value: number, type: ("ROW" | "COL")) => {

        const sizeX = cardData["tabs"][tabIdx]["sizeX"] + (type === "ROW" ? value : 0)
        const sizeY = cardData["tabs"][tabIdx]["sizeY"] + (type === "COL" ? value : 0)
        const tabFields = cardData["tabs"][tabIdx]["tabFields"]

        // will only ever add, when user submits, then when saving to db, reduce to only necessary fields
        for (let y = 1; y <= sizeY; y++) {
            for (let x = 1; x <= sizeX; x++) {
                const field = tabFields.find(i => i.posX === x && i.posY === y)
                if (!field) {
                    tabFields.push({
                        ...nullField,
                        posX: x,
                        posY: y,
                    })
                }
            }
        }

        const sizeType = type === "ROW" ? "sizeX" : "sizeY"
        const newCardData = update(cardData, {
            tabs: {
                [tabIdx]: {
                    [sizeType]: {
                        $set: cardData["tabs"][tabIdx][sizeType] + value
                    },
                    "tabFields": {
                        $set: tabFields
                    }
                }
            }
        })

        setData(newCardData)
    }

    return (
        <aside className="w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <span className="inline-block align-middle">Name</span>
                        <Input className="inline-block align-middle" defaultValue={cardData.name} />
                    </li>
                    <li className="flex justify-between">
                        <span>Rows:</span>
                        <div className="inline-flex">
                            <button onClick={() => updateNumber(-1, "ROW")}>
                                <ChevronDown />
                            </button>
                            <span className="inline-block align-middle">
                                {cardData.tabs[tabIdx].sizeX}
                            </span>
                            <button onClick={() => updateNumber(1, "ROW")}>
                                <ChevronUp />
                            </button>
                        </div>
                    </li>
                    <li className="flex justify-between">
                        <span>Columns:</span>
                        <div className="inline-flex">
                            <button onClick={() => updateNumber(-1, "COL")}>
                                <ChevronDown />
                            </button>
                            <span className="inline-block align-middle">
                                {cardData.tabs[tabIdx].sizeY}
                            </span>
                            <button onClick={() => updateNumber(1, "COL")}>
                                <ChevronUp />
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    )
}