"use client"

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
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FieldTypeProp, requiredIndicator } from "./Base"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

export const ComboboxForm = ({ fieldTypeData, name }: FieldTypeProp) => {
    const form = useFormContext()
    const [open, setOpen] = useState(false)

    const data = fieldTypeData.split(";")

    const isRequired = data[2] === "1"
    const label = data[0] + (isRequired ? requiredIndicator() : "")

    const itemsA: string[][] = data[1].split(",").map(i => i.split(":"))

    const items: { id: string, label: string }[] = []
    for (let i = 0; i < itemsA.length; i++) {
        items.push({
            id: itemsA[i][0],
            label: itemsA[i][1]
        })
    }
    // .reduce((acc, [a, b]) => ([...acc, {id: a, label:b}]), [])

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col" role="dropdown">
                    <FormLabel>{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-[200px] justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? items.find(
                                            (item) => item.id === field.value
                                        )?.label
                                        : "Select option"}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search..."
                                    className="h-9"
                                />
                                <CommandEmpty>No options found.</CommandEmpty>
                                <CommandGroup>
                                    {items.map((item) => (
                                        <CommandItem
                                            value={item.id}
                                            key={item.label}
                                            onSelect={() => {
                                                form.setValue(name, item.id)
                                                setOpen(false)
                                            }}
                                        >
                                            {item.label}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    item.id === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
