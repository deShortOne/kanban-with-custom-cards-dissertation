'use client'

import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useCardModal } from "./useDialog"
import { CardData } from "./field-type/Base"

export const CardModal = () => {
    const id = useCardModal(state => state.id)
    const isOpen = useCardModal(state => state.isOpen)
    const onClose = useCardModal(state => state.onClose)

    const { data: cardData } = useQuery<CardData>({
        queryKey: ["card", id],
        queryFn: () => (fetch("/api/card/data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        }).then((res) => res.json()))
    })

    console.log(cardData)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="h-[90vh] min-w-[90vw]">
                <div className='grid grid-cols-1 gap-4'>
                    <div className="mb-6 border">
                        <input type="text" id="title" className="block w-5/6 p-4 text-gray-900 rounded-lg sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-background text-xl" value={"title here"} />
                        <hr />
                    </div>
                    <button onClick={onClose}>
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
