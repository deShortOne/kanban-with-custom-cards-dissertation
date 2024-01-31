'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useCardModal } from "./useDialog"

export const CardModal = () => {
    const id = useCardModal(state => state.id)
    const isOpen = useCardModal(state => state.isOpen)
    const onClose = useCardModal(state => state.onClose)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                Modal
                <button onClick={onClose}>
                    Close
                </button>
            </DialogContent>
        </Dialog>
    )
}