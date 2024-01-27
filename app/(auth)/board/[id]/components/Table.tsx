'use client'
import { Card, KanbanColumn, KanbanSwimLane } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useState } from 'react'
import CardInfo from './CardInfo'
import TableCell from './TableCell'
import { DraggableColumn } from "./DraggableColumn"

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
    // columns
    const [stateColumns, setColumns] = useState(columns);

    const moveColumn = (dragIndex: number, hoverIndex: number) => {
        const draggedColumn = stateColumns[dragIndex];
        const newColumns = [...stateColumns];
        newColumns.splice(dragIndex, 1);
        newColumns.splice(hoverIndex, 0, draggedColumn);

        setColumns(newColumns);
    };

    // cards
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
                        {stateColumns.map((column, index) => (
                            <DraggableColumn key={column.id} column={column} index={index} moveColumn={moveColumn} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {swimlanes.map((swimLane) => (
                        <tr>
                            <td>
                                {swimLane.title}
                            </td>
                            {stateColumns.map((cell) => (
                                <TableCell onDrop={(item) => handleCardDrop(item.id, cell.id, swimLane.id)}>
                                    {cardsInfo.map((card) =>
                                        card.columnId === cell.id && card.swimLaneId === swimLane.id ? (
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
