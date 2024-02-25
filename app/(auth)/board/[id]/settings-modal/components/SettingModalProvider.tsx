"use client";

import { useEffect, useState } from "react";
import { KanbanSettingsModal, KanbanSettingsModalProps } from "../SettingModal";

export const SettingModalProvider = ({ id, title }: KanbanSettingsModalProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <KanbanSettingsModal id={id} title={title} />
        </>
    )
}
