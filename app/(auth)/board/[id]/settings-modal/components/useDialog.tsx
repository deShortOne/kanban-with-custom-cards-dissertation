import { create } from "zustand";

type KanbanModalSetting = {
    isOpen: boolean
    defaultTab: "general" | "card" | "share"
    onOpen: (tab?: "general" | "card" | "share") => void
    onClose: () => void
}

export const useKanbanModalSetting = create<KanbanModalSetting>((set) => ({
    isOpen: false,
    defaultTab: "general",
    onOpen: (tab = "general") => set(
        {
            isOpen: true,
            defaultTab: tab
        }
    ),
    onClose: () => set({ isOpen: false }),
}))
