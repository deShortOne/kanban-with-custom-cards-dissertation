"use client"

import update from 'immutability-helper'

import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import { DataProp, EmptyTab, NewField, Tab } from "./Base"
import { Dispatch, SetStateAction, useEffect } from "react"
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

interface prop {
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp>>
    tabIdx: number
    setCurrentTabIdx: Dispatch<SetStateAction<number>>
    saveDataToDB: () => Promise<void>
}

export const SideBar = ({ cardData, setData, tabIdx, setCurrentTabIdx, saveDataToDB }: prop) => {

    const updateNumber = (value: number, type: ("ROW" | "COL")) => {

        const sizeX = cardData["tabs"][tabIdx]["sizeX"] + (type === "COL" ? value : 0)
        const sizeY = cardData["tabs"][tabIdx]["sizeY"] + (type === "ROW" ? value : 0)
        const tabFields = cardData["tabs"][tabIdx]["tabFields"]

        // will only ever add, when user submits, then when saving to db, reduce to only necessary fields
        for (let y = 1; y <= sizeY; y++) {
            for (let x = 1; x <= sizeX; x++) {
                const field = tabFields.find(i => i.posX === x && i.posY === y)
                if (!field) {
                    tabFields.push({
                        ...NewField,
                        posX: x,
                        posY: y,
                    })
                }
            }
        }

        const sizeType = type === "COL" ? "sizeX" : "sizeY"
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

    const updateTabPosition = (fromIdx: number, toIdx: number) => {
        const cardDataTabs: Tab[] = JSON.parse(JSON.stringify(cardData["tabs"]))
        const temp = cardDataTabs[fromIdx]
        cardDataTabs[fromIdx] = cardDataTabs[toIdx]
        cardDataTabs[toIdx] = temp

        const newCardData = update(cardData, {
            tabs: {
                $set: cardDataTabs
            }
        })
        setData(newCardData)
        setCurrentTabIdx(toIdx)
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
                ...EmptyTab,
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

    const updateCardName = (name: string) => {
        const newCardData = update(cardData, {
            name: {
                $set: name
            }
        })
        setData(newCardData)
    }

    const updateTabName = (name: string) => {
        const cardDataTabs: Tab[] = JSON.parse(JSON.stringify(cardData["tabs"]))
        cardDataTabs[tabIdx].name = name
        const newCardData = update(cardData, {
            tabs: {
                $set: cardDataTabs
            },
        })
        setData(newCardData)
    }

    return (
        <aside
            id="asideCardSideBar"
            className="w-64 min-h-[94vh] transition-transform -translate-x-full sm:translate-x-0"
            aria-label="Sidebar"
        >
            <div className="flex flex-col min-h-[94vh] px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <span className="inline-block align-middle">Name of card</span>
                        <Input
                            id="cardName"
                            className="inline-block align-middle"
                            defaultValue={cardData.name}
                            onBlur={(e) => updateCardName(e.target.value)}
                        />
                    </li>
                    <li>
                        <Separator />
                    </li>
                    <li>
                        <span className="inline-block align-middle">Tab name</span>
                        <Input
                            id="cardTabName"
                            className="inline-block align-middle"
                            value={cardData.tabs[tabIdx].name}
                            onChange={(e) => updateTabName(e.target.value)}
                        />
                    </li>
                    <li className="flex justify-between">
                        <span>Position:</span>
                        <div className="inline-flex">
                            <button
                                id="btnDecrPosition"
                                disabled={tabIdx === 0}
                                className={tabIdx === 0 ? "text-black/50" : ""}
                                onClick={() => updateTabPosition(tabIdx, tabIdx - 1)}
                            >
                                <ChevronLeft />
                            </button>
                            <span
                                id="tabPositionNumber"
                                className="inline-block align-middle"
                            >
                                {tabIdx + 1}
                            </span>
                            <button
                                id="btnIncrPosition"
                                disabled={tabIdx === cardData["tabs"].length - 1}
                                className={tabIdx === cardData["tabs"].length - 1 ? "text-black/50" : ""}
                                onClick={() => updateTabPosition(tabIdx, tabIdx + 1)}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </li>
                    <li className="flex justify-between">
                        <span>Rows:</span>
                        <div className="inline-flex">
                            <button
                                id="btnDecrRowNumber"
                                disabled={cardData.tabs[tabIdx].sizeY < 2}
                                className={cardData.tabs[tabIdx].sizeY < 2 ? "text-black/50" : ""}
                                onClick={() => updateNumber(-1, "ROW")}
                            >
                                <ChevronUp />
                            </button>
                            <span
                                id="cardTabRowNumber"
                                className="inline-block align-middle"
                            >
                                {cardData.tabs[tabIdx].sizeY}
                            </span>
                            <button
                                id="btnIncrRowNumber"
                                onClick={() => updateNumber(1, "ROW")}
                            >
                                <ChevronDown />
                            </button>
                        </div>
                    </li>
                    <li className="flex justify-between">
                        <span>Columns:</span>
                        <div className="inline-flex">
                            <button
                                id="btnDecrColNumber"
                                disabled={cardData.tabs[tabIdx].sizeX < 2}
                                className={cardData.tabs[tabIdx].sizeX < 2 ? "text-black/50" : ""}
                                onClick={() => updateNumber(-1, "COL")}
                            >
                                <ChevronLeft />
                            </button>
                            <span
                                id="cardTabColNumber"
                                className="inline-block align-middle"
                            >
                                {cardData.tabs[tabIdx].sizeX}
                            </span>
                            <button
                                id="btnIncrColNumber"
                                onClick={() => updateNumber(1, "COL")}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </li>
                    <li className="flex justify-center">
                        <Button variant="outline" onClick={() => updateNumberOfTabs(-1)}>
                            Add new tab
                        </Button>
                    </li>
                    <li className="flex justify-center">
                        <Button
                            disabled={cardData.tabs.length < 2}
                            className={cardData.tabs.length < 2 ? "text-black/50" : ""}
                            variant="destructive"
                            onClick={() => updateNumberOfTabs(tabIdx)}>
                            Remove current tab
                        </Button>
                    </li>
                </ul>
                <div className="flex-1" />
                <Button variant={"outline"} onClick={() => saveDataToDB()}>
                    Save changes
                </Button>
            </div>
        </aside>
    )
}
