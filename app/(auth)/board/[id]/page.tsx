"use client"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useState } from 'react'
import Card from './components/Card'
import TableCell from './components/TableCell'


interface Div {
    id: number
    text: string
    cellId: number
}

const SelectKanbanPage = ({
    params
}: {
    params: { id: string }
}) => {
    if (!params.id) {
        redirect("/select-board")
    }

    const [divs, setDivs] = useState<Div[]>([
        { id: 1, text: 'Div 1', cellId: 1 },
        { id: 2, text: 'Div 2', cellId: 2 },
        { id: 3, text: 'Div 3', cellId: 2 },
    ]);

    const handleDrop = (divId: number, id: number) => {
        const updatedDivs = divs.map((div) =>
            div.id === divId ? { ...div, cellId: id } : div
        )
        setDivs(updatedDivs)
    }

    return (
        <main className="">
            <DndProvider backend={HTML5Backend}>
                <table style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <TableCell onDrop={(item) => handleDrop(item.id, 1)}>
                                {divs.map((div) =>
                                    div.cellId === 1 ? (
                                        <Card {...div} />
                                    ) : null
                                )}
                            </TableCell>
                            <TableCell onDrop={(item) => handleDrop(item.id, 2)}>
                                {divs.map((div) =>
                                    div.cellId === 2 ? (
                                        <Card {...div} />
                                    ) : null
                                )}
                            </TableCell>
                        </tr>
                        <tr>
                            <TableCell onDrop={(item) => handleDrop(item.id, 3)}>
                                {divs.map((div) =>
                                    div.cellId === 3 ? (
                                        <Card {...div} />
                                    ) : null
                                )}
                            </TableCell>
                        </tr>
                    </tbody>
                </table>
            </DndProvider>
        </main>
    )
}

export default SelectKanbanPage;
