"use client"

import { usePathname } from "next/navigation"
import { UserAccount } from "./UserProfile"
import { Session } from "next-auth"

export const NavBar = ({ session }: { session: Session }) => {

    const pathName = usePathname()

    const selectedOption = "block mt-1 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
    const notSelectedOption = "mt-1 block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 min-h-[5vh]">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/select-board" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        JKanban
                    </span>
                </a>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li
                            id="navSelectBoard"
                            className="h-[32px] inline-block align-middle">
                            <a href="/select-board"
                                className={"" + pathName === "/select-board" ? selectedOption : notSelectedOption}
                            >
                                Select board
                            </a>
                        </li>
                        <li>
                            <UserAccount session={session} />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
