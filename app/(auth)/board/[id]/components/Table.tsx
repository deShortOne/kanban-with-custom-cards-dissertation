'use client'
import { Card, Kanban, KanbanColumn, KanbanSwimLane } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useState } from 'react'
import CardInfo from './CardInfo'
import TableCell from './TableCell'

interface TableInformationProps {
    cards: Card[]
}

interface CardProps {
    id: number;
    title: string;
    order: number;
    description: string | null;
    columnId: number;
    swimLaneId: number;
}

export const Table = ({
    cards
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
                <tbody>
                    <tr>
                        <TableCell onDrop={(item) => handleCardDrop(item.id, 0, 0)}>
                            {cardsInfo.map((card) =>
                                card.columnId === 0 && card.swimLaneId === 0 ? (
                                    <CardInfo {...card} />
                                ) : null
                            )}
                        </TableCell>
                        <TableCell onDrop={(item) => handleCardDrop(item.id, 1, 0)}>
                            {cardsInfo.map((card) =>
                                card.columnId === 1 && card.swimLaneId === 0 ? (
                                    <CardInfo {...card} />
                                ) : null
                            )}
                        </TableCell>
                    </tr>
                    <tr>
                        <TableCell onDrop={(item) => handleCardDrop(item.id, 0, 1)}>
                            {cardsInfo.map((card) =>
                                card.columnId === 0 && card.swimLaneId === 1 ? (
                                    <CardInfo {...card} />
                                ) : null
                            )}
                        </TableCell>
                        <TableCell onDrop={(item) => handleCardDrop(item.id, 1, 1)}>
                            {cardsInfo.map((card) =>
                                card.columnId === 1 && card.swimLaneId === 1 ? (
                                    <CardInfo {...card} />
                                ) : null
                            )}
                        </TableCell>
                    </tr>
                </tbody>
            </table>
        </DndProvider>
    )
}