"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronUpIcon } from "@radix-ui/react-icons"
import { ChevronDown, ChevronUp } from "lucide-react"

interface prop {
    title: string,
    kanbanId: number,
}

export const SideBar = () => {
    return (
        <aside className="w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <span className="inline-block align-middle">Name</span>
                        <Input className="inline-block align-middle" />
                    </li>
                    <li className="inline-flex">
                        <ChevronDown />
                        <span className="inline-block align-middle">Number</span>
                        <ChevronUp />
                    </li>
                </ul>
            </div>
        </aside>
    )
}