import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

interface prop {
    url: string
    intercept: boolean
    title?: string
    message?: string
    text?: string
    continueMsg?: string
    cancelMsg?: string
}

const UnsavedChangesModal = ({
    url,
    intercept,
    title = "Warning - unsaved changes",
    message = "Are you sure you want to continue?",
    text = "Save",
    continueMsg = "Continue without saving",
    cancelMsg = "Return",
}: prop) => {
    if (!intercept) {
        return (
            <Button variant={"outline"}>
                <a href={url}>
                    {text}
                </a>
            </Button>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    {text}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="right-0">
                    <DialogClose>
                        <Button variant="destructive">
                            {cancelMsg}
                        </Button>
                    </DialogClose>
                    <DialogClose type="button">
                        <Button variant={"outline"}>
                            <a href={url}>
                                {continueMsg}
                            </a>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default UnsavedChangesModal
