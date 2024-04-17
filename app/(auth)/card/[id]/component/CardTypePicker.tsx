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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

export const CardTypePicker = () => {

    const [open, setOpen] = useState(false)
    const field: { value: string } = { value: "" }
    const items: { id: string, label: string }[] = []
    items.push({ id: "1", label: "example card type" })

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
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
    )
}
