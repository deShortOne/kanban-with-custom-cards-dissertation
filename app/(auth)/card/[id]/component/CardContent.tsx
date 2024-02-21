
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { TabsList } from "@radix-ui/react-tabs"
import { DataProp, FieldTypeProp } from "./Base"
import { Card } from "@/components/ui/card"
import { FieldCell } from "./FieldCell"

interface prop {
    allFieldTypes: FieldTypeProp[]
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp | undefined>>
}

export const CardContent = ({ allFieldTypes, cardData, setData }: prop) => {
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
                    <Tabs defaultValue={cardData.tabs[0].name}>
                        <TabsList>
                            {cardData.tabs.map(tab => {
                                return <TabsTrigger value={tab.name}>{tab.name}</TabsTrigger>
                            })}
                        </TabsList>

                        {cardData.tabs.map((tab, tabIdx) => {
                            const fields = []
                            for (let y = 1; y <= tab.sizeY; y++) {
                                for (let x = 1; x <= tab.sizeX; x++) {
                                    const templateField = tab.tabFields.find(i => i.posX === x && i.posY === y)
                                    fields.push(templateField)
                                }
                            }
                            return <TabsContent value={tab.name}>
                                <div className={"grid grid-cols-" + tab.sizeX + " gap-10"}>
                                    {fields.map((field, fieldIdx) => {
                                        if (!field) {
                                            return <div />
                                        }
                                        return (
                                            <FieldCell
                                                allFieldTypes={allFieldTypes}
                                                cardData={cardData}
                                                setData={setData}
                                                position={[tabIdx, fieldIdx]}
                                                fieldData={field}/>
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