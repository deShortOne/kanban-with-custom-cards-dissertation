"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { FieldTypeProp } from "./Base"

interface prop {
    allFieldTypes: FieldTypeProp[],
    fieldType: FieldTypeProp,
    data: string
}

export const FieldCell = ({allFieldTypes, fieldType, data}: prop) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(fieldType.id)

    const title = data.split(";")[0]

    return (
        <Card className="max-w-[250px] max-h-[100px]">
            <div className="flex justify-center">{title}</div>
            <div className="flex justify-between p-1">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="default"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value
                                ? allFieldTypes.find((field) => field.id === value)?.name
                                : "Select field..."}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandGroup>
                                {allFieldTypes.map((field) => (
                                    <CommandItem
                                        key={field.id}
                                        value={field.name}
                                        onSelect={(currentValue) => {
                                            const val = parseInt(currentValue)
                                            setValue(val === value ? -1 : val)
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

                <img src="/setting.svg" />
            </div>
        </Card>
    )
}
