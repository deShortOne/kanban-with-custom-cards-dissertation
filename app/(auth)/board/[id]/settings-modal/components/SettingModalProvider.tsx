"use client";

import { useEffect, useState } from "react";
import { KanbanSettingsModal } from "../SettingModal";

export const SettingModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <KanbanSettingsModal />
    </>
  )
}