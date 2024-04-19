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
import { Dispatch, SetStateAction, useState } from "react"
import { CardType, DataProp } from "./Base"
import { Separator } from "@radix-ui/react-select"
import { CardTypeModal } from "./card-type-modal/Modal"

interface prop {
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp>>
    currentCardType: number
    cardTypes: CardType[]
    setCardTypes: Dispatch<SetStateAction<CardType[]>>
    kanbanId: number
}

export const CardTypePicker = ({ cardData, setData, currentCardType, cardTypes, setCardTypes, kanbanId }: prop) => {

    const [open, setOpen] = useState(false)

    const cardTypeName = cardTypes.find(
        (cardType) => cardType.id === currentCardType
    )?.name

    const updateCardType = (id: number) => {
        const newCardData = JSON.parse(JSON.stringify(cardData))
        newCardData.cardTypeId = id
        setData(newCardData)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id="cardTypeName"
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
            <PopoverContent
                id="cardTypeSelectorBox"
                className="w-[200px] p-0"
            >
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
                                    updateCardType(cardType.id)
                                    setOpen(false)
                                }}
                            >
                                {cardType.name}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        cardType.id === currentCardType
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                        <Separator />
                        <CommandItem
                            value="Card type settings"
                        >
                            <CardTypeModal
                                cardData={cardData}
                                kanbanId={kanbanId}
                                cardTypes={cardTypes}
                                setCardTypes={setCardTypes}
                            />
                        </CommandItem>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
