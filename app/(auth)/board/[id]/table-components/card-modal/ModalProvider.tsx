"use client";

import { useEffect, useState } from "react";
import { CardModal } from "./CardModal";

export interface prop {
    updateCardTitle: (cardId: number, newTitle: string) => Promise<void>
}

export const ModalProvider = ({ updateCardTitle }: prop) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CardModal updateCardTitle={updateCardTitle} />
        </>
    )
}
