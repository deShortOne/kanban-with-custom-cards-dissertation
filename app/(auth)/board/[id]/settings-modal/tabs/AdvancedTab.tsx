"use client"

import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { deleteKanbanBoard } from "./actions"

export const AdvancedTab = ({ id }: { id: number }) => {

    return (
        <TabsContent
            value="advanced"
            id="tabSettingAdvanced"
            className="flex items-center justify-center"
        >
            <form action={deleteKanbanBoard}>
                <input hidden name="id" value={id} />
                <Button
                    type="submit"
                    variant={"destructive"}
                >
                    Delete kanban board
                </Button>
            </form>
        </TabsContent>
    )
}
