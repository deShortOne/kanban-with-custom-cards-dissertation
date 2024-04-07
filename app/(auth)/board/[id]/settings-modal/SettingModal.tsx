import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./tabs/GeneralTab";
import { ShareTab } from "./tabs/ShareTab";
import { CardTab } from "./tabs/CardTab";
import { useKanbanModalSetting } from "./components/useDialog";
import { AdvancedTab } from "./tabs/AdvancedTab";

export interface KanbanSettingsModalProps {
    id: number
    title: string
}

export const KanbanSettingsModal = ({ id, title }: KanbanSettingsModalProps) => {
    const isOpen = useKanbanModalSetting(state => state.isOpen)
    const defaultTab = useKanbanModalSetting(state => state.defaultTab)
    const onClose = useKanbanModalSetting(state => state.onClose)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent
                id="dialogKanbanSettings"
                className="h-[90vh] max-w-[500px] max-h-[60vh]"
            >
                <Tabs defaultValue={defaultTab}>
                    <div className="flex justify-center mx-auto p-4">
                        <TabsList>
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="card">Cards</TabsTrigger>
                            <TabsTrigger value="share">Share</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>
                    </div>

                    <GeneralTab id={id} title={title} />
                    <ShareTab id={id} />
                    <CardTab id={id} />
                    <AdvancedTab id={id} />
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
