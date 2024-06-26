"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import update from 'immutability-helper'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { DataProp, FieldProp, FieldTypeProp } from "@/app/types/CardContents"
import { CardTemplateTabFieldModal } from "./CardModal"
import { CardEditCommonProps } from "../MainContent";

interface prop extends CardEditCommonProps {
    allFieldTypes: FieldTypeProp[]
    position: number[]
    fieldData: FieldProp
}

export const FieldCell = ({ allFieldTypes, cardData, setData, position, fieldData }: prop) => {
    const [open, setOpen] = useState(false)

    const updateFieldType = (fieldTypeId: number) => {
        const fieldType = allFieldTypes.find(i => i.id === fieldTypeId)
        const newCardData = update(cardData, {
            tabs: {
                [position[0]]: {
                    tabFields: {
                        [position[1]]: {
                            data: {
                                $set: fieldTypeId === -1 ? "Select field" : fieldData.data.split(";")[0] // TODO keep ; removed
                            },
                            fieldType: {
                                $set: fieldType as FieldTypeProp
                            }
                        }
                    }
                }
            }
        })

        setData(newCardData)
    }

    const title = fieldData.data.split(";")[0]
    const value = fieldData.fieldType.id

    return (
        <Card className="max-w-[250px] max-h-[100px]">
            <div className="flex justify-center">{title}</div>
            <div className="flex justify-between p-1">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[250px] justify-between"
                        >
                            {value
                                ? allFieldTypes.find((field) => field.id === value)?.name
                                : "Select field..."}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0">
                        <Command>
                            <CommandGroup>
                                {allFieldTypes.map((field) => (
                                    <CommandItem
                                        key={field.id}
                                        value={field.name}
                                        onSelect={() => {
                                            updateFieldType(field.id)
                                            setOpen(false)
                                        }}
                                    >
                                        {field.name}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === field.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>

                {value !== -1 &&
                    <CardTemplateTabFieldModal
                        cardData={cardData}
                        setData={setData}
                        data={fieldData.data}
                        position={position}
                        fieldType={fieldData.fieldType}
                    />
                }
            </div>
        </Card>
    )
}
