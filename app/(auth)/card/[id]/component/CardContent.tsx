
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { TabsList } from "@radix-ui/react-tabs"
import { DataProp, FieldProp, FieldTypeProp } from "./Base"
import { Card } from "@/components/ui/card"
import { FieldCell } from "./FieldCell"

interface prop {
    allFieldTypes: FieldTypeProp[]
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp | undefined>>
    currTabIdx: number
    setCurrentTabIdx: Dispatch<SetStateAction<number>>
}

export const CardContent = ({ allFieldTypes, cardData, setData, currTabIdx, setCurrentTabIdx }: prop) => {
    return (
        <div className="flex items-center justify-center w-screen h-[80vh]">
            <Card className="h-[70vh] min-w-[70vw]">
                <form className="space-y-8">
                    <div className="flex">
                        <Input disabled placeholder="Title"></Input>

                        <Button type="submit" className="bg-cyan-500" disabled>Save</Button>
                        <Button type="button" className="bg-rose-600" disabled>
                            <img src="/delete.svg"></img>
                        </Button>
                    </div>
                    <Tabs value={cardData.tabs[currTabIdx].name}>
                        <TabsList>
                            {cardData.tabs.map((tab, tabIdx) => {
                                return (
                                    <TabsTrigger
                                        value={tab.name}
                                        onClick={() => setCurrentTabIdx(tabIdx)}
                                        key={tab.name}
                                    >
                                        {tab.name}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>

                        {cardData.tabs.map((tab, tabIdx) => {
                            const fields: ([FieldProp, number])[] = []
                            for (let y = 1; y <= tab.sizeY; y++) {
                                for (let x = 1; x <= tab.sizeX; x++) {
                                    const templateField = tab.tabFields.find(i => i.posX === x && i.posY === y) as FieldProp
                                    const templateFieldIdx = tab.tabFields.findIndex(i => i.posX === x && i.posY === y)

                                    fields.push([templateField, templateFieldIdx])
                                }
                            }
                            return <TabsContent value={tab.name} key={tab.name}>
                                <div className={"grid grid-cols-" + tab.sizeX + " gap-10"}>
                                    {fields.map((field, index) => {
                                        if (!field) {
                                            return <div key={index + tab.name} />
                                        }
                                        return (
                                            <FieldCell
                                                allFieldTypes={allFieldTypes}
                                                cardData={cardData}
                                                setData={setData}
                                                position={[tabIdx, field[1]]}
                                                fieldData={field[0]}
                                                key={index + tab.name} />
                                        )
                                    })}
                                </div>
                            </TabsContent>
                        })}
                    </Tabs>
                </form>
            </Card>
        </div>
    )
}
