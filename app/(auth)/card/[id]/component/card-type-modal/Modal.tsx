import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { CardType, DataProp } from "../Base"
import { useState } from "react"

interface prop {
    cardData: DataProp
    kanbanId: number
    cardTypes: CardType[]
}

export const CardTypeModal = ({ cardData, kanbanId, cardTypes }: prop) => {

    const form = useForm<CardType[]>()
    const [cardTypesCurr, setCardTypes] = useState<CardType[]>(cardTypes)
    const [negativeCounter, setNegativeCounter] = useState(-1)

    async function onSubmit(data: any) {
        await fetch("/api/card/allTypes", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: kanbanId,
                cardTemplateData: cardData,
                ...data
            }),
        })
    }

    const addCardType = () => {
        const updatedList = [...cardTypesCurr]
        updatedList.push({
            id: negativeCounter,
            name: "",
            cardTemplateId: -1
        })
        setCardTypes(updatedList)
        setNegativeCounter(negativeCounter - 1)
    }

    const removeCardType = (cardTypeId: number) => {
        const updatedList = [...cardTypesCurr]
        const posOfCardTypeToRemove = updatedList.findIndex(cardType => cardType.id === cardTypeId)
        updatedList.splice(posOfCardTypeToRemove, 1)
        setCardTypes(updatedList)

        // could just pass userPermissions list to api
        form.unregister(`${cardTypeId}`)
    }

    const onError = (errors: any, e: any) => console.log(errors, e)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex">
                    <Pencil2Icon className="mr-2 h-4 w-4" />
                    <span>Edit Card Types</span>
                </div>
            </DialogTrigger>
            <DialogContent
                id="cardTypeEditModal"
                className=""
            >
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <DialogHeader>
                        <DialogTitle>Edit Card Types</DialogTitle>
                        <DialogDescription>
                            Add, remove or edit card types
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {cardTypesCurr.map(i => {
                            return (
                                <section
                                    key={i.id}
                                    className="grid grid-cols-6 items-center gap-4"
                                >
                                    <Input
                                        {...form.register(`${i.id}`)}
                                        className="col-span-5"
                                        defaultValue={i.name}
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => removeCardType(i.id)}
                                        className="col-span-1"
                                    >
                                        <TrashIcon width={24} height={24} />
                                    </Button>
                                </section>
                            )
                        })}

                    </div>
                    <DialogFooter className="grid grid-cols-3">
                        <Button onClick={addCardType} variant={"secondary"} type="button">
                            Add new card type
                        </Button>
                        <div className="col-span-1" />
                        <DialogClose
                            type="submit"
                        >
                            Save changes
                        </DialogClose>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
