'use client'

import prisma from "@/lib/prisma";

const SelectKanbanPage = async () => {
    const boards = await prisma.kanban.findMany({
        orderBy: {
            title: "asc"
        }
    })

    return (
        <main className="inline-flex items-center justify-center w-full h-screen">
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700">
                <h5 className="px-6 pt-4 items-center justify-center w-full mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Select board
                </h5>
                <p className="px-6 items-center justify-center w-full mb-3 font-normal text-gray-700 dark:text-gray-400">
                    to view...
                </p>

                <div className="w-full">
                    <div className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {boards.map((board) => (
                            <a href={"http://localhost:3000/board/" + board.id} className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                {board.title}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="relative inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                        or
                    </span>
                </div>
                <div className="relative inline-flex items-center justify-center w-full">
                    <a type="button"
                        href="select-board/new"
                        className="cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-6 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        Add new board
                    </a>
                </div>

            </div>
        </main>
    )
}

export default SelectKanbanPage;
