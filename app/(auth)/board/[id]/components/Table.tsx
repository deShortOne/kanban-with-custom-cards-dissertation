'use client'
import { Card, KanbanColumn, KanbanSwimLane } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useState } from 'react'
import CardInfo from './CardInfo'
import TableCell from './TableCell'
import { DraggableColumn } from "./DraggableColumn"
import { DraggableSwimLane } from "./DraggableSwimLane"

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
    /* COLUMN */
    // move column
    const [stateColumns, setColumns] = useState(columns)
    const moveColumn = (dragIndex: number, hoverIndex: number) => {
        const draggedColumn = stateColumns[dragIndex]
        const newColumns = [...stateColumns]
        newColumns.splice(dragIndex, 1)
        newColumns.splice(hoverIndex, 0, draggedColumn)

        setColumns(newColumns)

        fetch('/api/headers/reorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: stateColumns[0].boardId,
                type: "COLUMN",
                headers: newColumns.map(cell => cell.id)
            }),
        })
    }

    // add column
    const addColumn = async () => {
        const response = await fetch('/api/headers/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "COLUMN",
                order: stateColumns.length + 1,
                boardId: stateColumns[0].boardId
            }),
        })

        const newColumns = [...stateColumns];
        newColumns.push({
            id: await response.json(),
            title: "New Column",
            order: newColumns.length + 1,
            boardId: newColumns[0].boardId,
        } as KanbanColumn)
        setColumns(newColumns)
    }

    // remove column
    const removeColumn = async (columnId: number) => {
        const newColumns = [...stateColumns]
        newColumns.splice(columnId, 1)
        setColumns(newColumns)
    }

    /* SWIM LANE */
    // move swim lane
    const [stateSwimLanes, setSwimLanes] = useState(swimlanes)
    const moveSwimLane = (dragIndex: number, hoverIndex: number) => {
        const draggedSwimLane = stateSwimLanes[dragIndex]
        const newSwimLanes = [...stateSwimLanes]
        newSwimLanes.splice(dragIndex, 1)
        newSwimLanes.splice(hoverIndex, 0, draggedSwimLane)

        setSwimLanes(newSwimLanes);

        fetch('/api/headers/reorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: stateColumns[0].boardId,
                type: "SWIMLANE",
                headers: newSwimLanes.map(cell => cell.id)
            }),
        })
    }

    // add swim lane
    const addSwimLane = async () => {
        const response = await fetch('/api/headers/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "SWIMLANE",
                order: stateSwimLanes.length + 1,
                boardId: stateSwimLanes[0].boardId
            }),
        })

        const draggedSwimLane = [...stateSwimLanes];
        draggedSwimLane.push({
            id: await response.json(),
            title: "New Swimlane",
            order: draggedSwimLane.length + 1,
            boardId: draggedSwimLane[0].boardId,
        } as KanbanColumn)
        setSwimLanes(draggedSwimLane)
    }

    /* CARD */
    // move card
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
                            <DraggableColumn key={column.id} column={column} index={index} moveColumn={moveColumn} removeColumn={removeColumn}/>
                        ))}
                        <th>
                            <button
                                type="button"
                                onClick={addColumn}
                            >
                                Add new
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {stateSwimLanes.map((swimLane, index) => (
                        <tr key={swimLane.id}>
                            <DraggableSwimLane key={swimLane.id} swimLane={swimLane} index={index} moveSwimLane={moveSwimLane} />
                            {stateColumns.map((cell) => (
                                <TableCell onDrop={(item) => handleCardDrop(item.id, cell.id, swimLane.id)}
                                    key={cell.id + " " + swimLane.id}
                                >
                                    {cardsInfo.map((card) =>
                                        card.columnId === cell.id && card.swimLaneId === swimLane.id ? (
                                            <CardInfo {...card} key={card.id} />
                                        ) : null
                                    )}
                                </TableCell>
                            ))}
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <button
                                type="button"
                                onClick={addSwimLane}
                            >
                                Add new
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </DndProvider>
    )
}
