"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./tabs/GeneralTab";
import { ShareTab } from "./tabs/ShareTab";
import { CardTab } from "./tabs/CardTab";
import { useQuery } from "@tanstack/react-query";
import { useKanbanModal } from "./components/useDialog";

export const KanbanSettingsModal = () => {
    const id = useKanbanModal(state => state.id)
    const isOpen = useKanbanModal(state => state.isOpen)
    const onClose = useKanbanModal(state => state.onClose)

    // const { data: kanbanData } = useQuery<KanbanData>({
    //     queryKey: ["card", id],
    //     queryFn: () => (fetch("/api/", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             id: id,
    //         }),
    //     }).then((res) => res.json()))
    // })
    
    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="h-[90vh] max-w-[40vw] max-h-[60vh]">
                <Tabs defaultValue="general">
                    <div className="flex justify-center mx-auto p-4">
                        <TabsList>
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="card">Cards</TabsTrigger>
                            <TabsTrigger value="share">Share</TabsTrigger>
                        </TabsList>
                    </div>

                    <GeneralTab title={"title goes ehre"} />
                    <CardTab />
                    <ShareTab />
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
