import { create } from "zustand";

type CardModalStore = {
    id?: number
    isOpen: boolean
    onOpen: (id: number) => void
    onClose: () => void
}

export const useCardModal = create<CardModalStore>((set) => ({
    id: -1,
    isOpen: false,
    onOpen: (id: number) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: -1 }),
}))
