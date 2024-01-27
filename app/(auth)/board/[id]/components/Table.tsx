'use client'
import { Kanban } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useState } from 'react'
import CardInfo from './CardInfo'
import TableCell from './TableCell'

interface TableInformationProps {
    kanban: Kanban,
}

interface Div {
    id: number
    text: string
    cellId: number
}

export const Table = ({
    kanban
}: TableInformationProps) => {
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
        <DndProvider backend={HTML5Backend}>
                <table style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <TableCell onDrop={(item) => handleDrop(item.id, 1)}>
                                {divs.map((div) =>
                                    div.cellId === 1 ? (
                                        <CardInfo {...div} />
                                    ) : null
                                )}
                            </TableCell>
                            <TableCell onDrop={(item) => handleDrop(item.id, 2)}>
                                {divs.map((div) =>
                                    div.cellId === 2 ? (
                                        <CardInfo {...div} />
                                    ) : null
                                )}
                            </TableCell>
                        </tr>
                        <tr>
                            <TableCell onDrop={(item) => handleDrop(item.id, 3)}>
                                {divs.map((div) =>
                                    div.cellId === 3 ? (
                                        <CardInfo {...div} />
                                    ) : null
                                )}
                            </TableCell>
                        </tr>
                    </tbody>
                </table>
            </DndProvider>
    )
}