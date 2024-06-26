"use client"

import { Role } from "@prisma/client";
import { useKanbanModalSetting } from "../settings-modal/components/useDialog";

interface prop {
    title: string
    role: Role
}

export const KanbanNavBar = ({ title, role }: prop) => {
    const kanbanSettingModal = useKanbanModalSetting()

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                <span
                    id="kanbanTitle"
                    className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                    {title}
                </span>

                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {
                            role === Role.EDITOR &&
                            <li>
                                <button onClick={() => kanbanSettingModal.onOpen()}>
                                    Setting
                                </button>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}
