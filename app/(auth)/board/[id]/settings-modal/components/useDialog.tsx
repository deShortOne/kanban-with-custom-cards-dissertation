import { create } from "zustand";

type KanbanModalStore = {
  id?: number
  title?: string
  isOpen: boolean
  onOpen: (id: number, title: string) => void
  onClose: () => void
}

export  const useKanbanModal = create<KanbanModalStore>((set) => ({
  id: -1,
  isOpen: false,
  onOpen: (id: number, title: string) => set({ isOpen: true, id, title }),
  onClose: () => set({ isOpen: false, id: -1, title: undefined }),
}))
