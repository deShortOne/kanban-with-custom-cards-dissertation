"use client"

import { CaretSortIcon } from "@radix-ui/react-icons"

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
import { CardType } from "./Base"

interface prop {
    currentCardType: number
    cardTypes: CardType[]
}

export const CardTypeSwitcher = ({ currentCardType, cardTypes }: prop) => {

    const [open, setOpen] = useState(false)

    const cardTypeName = cardTypes.find(
        (cardType) => cardType.id === currentCardType
    )?.name

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-[200px] justify-between",
                        !cardTypeName && "text-muted-foreground"
                    )}
                >
                    {cardTypeName}
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
                        {cardTypes.map((cardType) => (
                            <CommandItem
                                value={cardType.id.toString()}
                                key={cardType.name}
                                onSelect={() => {
                                    setOpen(false)
                                    window.location.href = "/card/" + cardType.cardTemplateId
                                }}
                                disabled={cardType.id === currentCardType}
                            >
                                {cardType.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
