'use client'
import { Card, KanbanColumn, KanbanSwimLane } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useState } from 'react'
import CardInfo from './CardInfo'
import TableCell from './TableCell'

interface TableInformationProps {
    columns: KanbanColumn[]
    swimlanes: KanbanSwimLane[]
    cards: Card[]
}

interface CardProps {
    id: number
    title: string
    order: number
    description: string | null
    columnId: number
    swimLaneId: number
}

export const Table = ({
    columns, swimlanes, cards
}: TableInformationProps) => {

    const [cardsInfo, setCard] = useState<CardProps[]>(cards);

    const handleCardDrop = (cardId: number, columnId: number, rowId: number) => {
        const updatedCard = cardsInfo.map((card) =>
            card.id === cardId ? { ...card, columnId: columnId, swimLaneId: rowId } : card
        )
        setCard(updatedCard)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th />
                        {columns.map(column => (
                            <th>
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {swimlanes.map((swimLane, indexSwimLane) => (
                        <tr>
                            <td>
                                {swimLane.title}
                            </td>
                            {columns.map((_, indexColumn) => (
                                <TableCell onDrop={(item) => handleCardDrop(item.id, indexColumn, indexSwimLane)}>
                                    {cardsInfo.map((card) =>
                                        card.columnId === indexColumn && card.swimLaneId === indexSwimLane ? (
                                            <CardInfo {...card} />
                                        ) : null
                                    )}
                                </TableCell>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </DndProvider>
    )
}
