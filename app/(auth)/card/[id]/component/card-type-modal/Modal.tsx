import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { CardType } from "../Base"
import { useState } from "react"

interface prop {
    kanbanId: number
    cardTypes: CardType[]
}

export const CardTypeModal = () => {

    const form = useForm<CardType[]>()
    const [cardTypes, setCardTypes] = useState<CardType[]>([])
    const [negativeCounter, setNegativeCounter] = useState(-1)

    async function onSubmit(data: any) {
        await fetch("/api/board/settings/share", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: 1,
                ...data
            }),
        })
    }

    const addCardType = () => {
        const updatedList = [...cardTypes]
        updatedList.push({
            id: negativeCounter,
            name: ""
        })
        setCardTypes(updatedList)
        setNegativeCounter(negativeCounter - 1)
    }

    const removeCardType = (cardTypeId: number) => {
        const updatedList = [...cardTypes]
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
            <DialogContent className="">
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <DialogHeader>
                        <DialogTitle>Edit Card Types</DialogTitle>
                        <DialogDescription>
                            Add, remove or edit card types
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">

                        {cardTypes.map(i => {
                            return (
                                <div
                                    key={i.id}
                                    className="grid grid-cols-6 items-center gap-4"
                                >
                                    <Input
                                        {...form.register(`${i.id}`)}
                                        className="col-span-5"
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => removeCardType(i.id)}
                                        className="col-span-1"
                                    >
                                        <TrashIcon width={24} height={24} />
                                    </Button>
                                </div>
                            )
                        })}

                    </div>
                    <DialogFooter className="grid grid-cols-3">
                        <Button onClick={addCardType} variant={"secondary"} type="button">
                            Add new card type
                        </Button>
                        <div className="col-span-1" />
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
