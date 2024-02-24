import { create } from "zustand";

type KanbanModalStore = {
  id?: number
  title?: string
  isOpen: boolean
  defaultTab: "general" | "card" | "share"
  setTitle: (title: string) => void
  onOpen: (id: number, tab?: "general" | "card" | "share") => void
  onClose: () => void
}

export const useKanbanModal = create<KanbanModalStore>((set) => ({
  id: -1,
  isOpen: false,
  defaultTab: "general",
  setTitle: (title: string) => set({ title }),
  onOpen: (id: number, tab = "general") => set(
    {
      isOpen: true,
      id,
      defaultTab: tab
    }
  ),
  onClose: () => set({ isOpen: false, id: -1, title: undefined }),
}))
