import { create } from "zustand";

type KanbanModalStore = {
  id?: number
  isOpen: boolean
  onOpen: (id: number) => void
  onClose: () => void
}

export  const useKanbanModal = create<KanbanModalStore>((set) => ({
  id: -1,
  isOpen: false,
  onOpen: (id: number) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: -1 }),
}))
