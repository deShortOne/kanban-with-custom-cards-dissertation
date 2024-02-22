"use client"

import update from 'immutability-helper'

import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp } from "lucide-react"
import { DataProp, FieldProp, Tab } from "./Base"
import { Dispatch, SetStateAction } from "react"
import { Separator } from '@/components/ui/separator'
import { nullField } from '../page'
import { Button } from '@/components/ui/button'

interface prop {
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp | undefined>>
    nullField: FieldProp
    tabIdx: number
    setCurrentTabIdx: Dispatch<SetStateAction<number>>
}

const newField = {
    data: "New input",
    posX: 1,
    posY: 1,
    fieldType: {
        id: -1,
        name: "null",
        description: ""
    }
    // instead of using nullField from page, it returns
    // rEfErEnCeeRrOr: cAnNoT aCcEsS 'nullField' bEfOrE iNiTiAlIzAtIoN
    // I could put it in SideBar, but
}

const emptyTab: Tab = {
    name: "New tab",
    order: -1,
    sizeX: 1,
    sizeY: 1,
    tabFields: [JSON.parse(JSON.stringify(newField))]
}

export const SideBar = ({ cardData, setData, tabIdx, nullField, setCurrentTabIdx }: prop) => {

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

    // this is more permanent
    // -1 to add a new tab
    // otherwise tab position
    const updateNumberOfTabs = (value: number) => {
        // need to deepclone otherwise it will think the array has not been updated as 
        // it refers to the same one
        const cardDataTabs = JSON.parse(JSON.stringify(cardData["tabs"]))
        if (value === -1) {
            cardDataTabs.push({
                ...emptyTab,
                name: "Tab " + (cardDataTabs.length + 1),
                order: cardDataTabs.length + 1
            })
        } else {
            cardDataTabs.splice(value, 1)
        }

        const newCardData = update(cardData, {
            tabs: {
                $set: cardDataTabs
            }
        })
        setData(newCardData)
        setCurrentTabIdx(cardDataTabs.length - 1)
    }

    return (
        <aside className="w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <span className="inline-block align-middle">Name of card</span>
                        <Input className="inline-block align-middle" defaultValue={cardData.name} />
                    </li>
                    <li>
                        <Separator />
                    </li>
                    <li>
                        <span className="inline-block align-middle">Tab name</span>
                        <Input className="inline-block align-middle" defaultValue={cardData.tabs[tabIdx].name} />
                    </li>
                    <li className="flex justify-between">
                        <span>Position:</span>
                        <div className="inline-flex">
                            <button onClick={() => updateNumber(0, "ROW")}>
                                <ChevronDown />
                            </button>
                            <span className="inline-block align-middle">
                                {tabIdx}
                            </span>
                            <button>
                                <ChevronUp onClick={() => updateNumber(0, "ROW")} />
                            </button>
                        </div>
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
                    <li>
                        <Button onClick={() => updateNumberOfTabs(-1)}>
                            Add new tab
                        </Button>
                    </li>
                    <li>
                        <Button variant="destructive" onClick={() => updateNumberOfTabs(tabIdx)}>
                            Remove current tab
                        </Button>
                    </li>
                </ul>
            </div>
        </aside>
    )
}