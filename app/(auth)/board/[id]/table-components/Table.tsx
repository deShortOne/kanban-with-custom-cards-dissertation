'use client'
import { Card, KanbanColumn, KanbanSwimLane, User } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useState } from 'react'
import CardInfo from './CardInfo'
import TableCell from './TableCell'
import { DraggableColumn } from "./DraggableColumn"
import { DraggableSwimLane } from "./DraggableSwimLane"
import { AddNewCardButton } from "./NewCardButton"

interface TableInformationProps {
    id: number
    columns: KanbanColumn[]
    swimlanes: KanbanSwimLane[]
    cards: Card[]
}

interface CardProps {
    id: number
    title: string
    order: number
    developer?: User
    description: string | null
    columnId: number
    swimLaneId: number
    cardTypeId: number
}

export const Table = ({
    id, columns, swimlanes, cards
}: TableInformationProps) => {
    const boardId = id

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
                boardId: boardId,
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
                boardId: boardId,
            }),
        })

        const newColumns = [...stateColumns]
        newColumns.push({
            id: await response.json(),
            title: "New Column",
            order: newColumns.length + 1,
            boardId: boardId,
        } as KanbanColumn)
        setColumns(newColumns)
    }

    // remove column
    const removeColumn = async (columnId: number, columnOrder: number) => {
        let hasNoCards = cardsInfo.findIndex(card => card.columnId === columnId) === -1
        if (hasNoCards) {
            const newColumns = [...stateColumns]

            newColumns.splice(columnOrder, 1)
            setColumns(newColumns)

            fetch('/api/headers/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: columnId,
                    type: "COLUMN",
                    boardId: boardId,
                }),
            })
        } else {
            alert("Remove all cards from this column")
        }
    }

    /* SWIM LANE */
    // move swim lane
    const [stateSwimLanes, setSwimLanes] = useState(swimlanes)
    const moveSwimLane = (dragIndex: number, hoverIndex: number) => {
        const draggedSwimLane = stateSwimLanes[dragIndex]
        const newSwimLanes = [...stateSwimLanes]
        newSwimLanes.splice(dragIndex, 1)
        newSwimLanes.splice(hoverIndex, 0, draggedSwimLane)

        setSwimLanes(newSwimLanes)

        fetch('/api/headers/reorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: boardId,
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
                boardId: boardId,
            }),
        })

        const draggedSwimLane = [...stateSwimLanes]
        draggedSwimLane.push({
            id: await response.json(),
            title: "New Swimlane",
            order: draggedSwimLane.length + 1,
            boardId: boardId,
        } as KanbanColumn)
        setSwimLanes(draggedSwimLane)
    }

    // remove swim lane
    const removeSwimLane = async (swimLaneId: number, swimLaneOrder: number) => {
        let hasNoCards = cardsInfo.findIndex(card => card.swimLaneId === swimLaneId) === -1
        if (hasNoCards) {
            const newSwimLane = [...stateSwimLanes]

            newSwimLane.splice(swimLaneOrder, 1)
            setSwimLanes(newSwimLane)

            fetch('/api/headers/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: swimLaneId,
                    type: "SWIMLANE",
                    boardId: boardId,
                }),
            })
        } else {
            alert("Remove all cards from this swim lane")
        }
    }

    /* CARD */
    // move card
    const [cardsInfo, setCard] = useState<CardProps[]>(cards)
    const handleCardDrop = (cardId: number, columnId: number, rowId: number) => {
        const updatedCard = cardsInfo.map((card) =>
            card.id === cardId ? { ...card, columnId: columnId, swimLaneId: rowId } : card
        )
        setCard(updatedCard)

        fetch('/api/card/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                card: updatedCard.find(element => element.id == cardId)
            }),
        })
    }

    // new card
    const addCard = async (cardTypeId: number) => {
        console.log("card type id is " + cardTypeId)
        const orderPos = cardsInfo.filter(i => i.columnId === -1).length + 1
        const response = await fetch('/api/card/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order: orderPos,
                boardId: boardId,
                cardTypeId: cardTypeId,
            }),
        })

        const updatedCards = [...cardsInfo]
        updatedCards.push({
            id: await response.json(),
            title: "To be updated",
            order: orderPos,
            description: null,
            columnId: -1,
            swimLaneId: -1,
            kanbanId: boardId,
            developer: undefined,
            cardTypeId: cardTypeId,
        } as CardProps)
        setCard(updatedCards)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex">
                <div className="h-full">
                    <AddNewCardButton kanbanId={boardId} newCardAction={addCard}/>
                    <table style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <TableCell onDrop={(item) => handleCardDrop(item.id, -1, -1)}
                                    key={"-1 -1"}
                                >
                                    {cardsInfo.map((card) =>
                                        card.columnId === -1 && card.swimLaneId === -1 ? (
                                            <CardInfo {...card} key={card.id} />
                                        ) : null
                                    )}
                                </TableCell>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <table style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th />
                            {stateColumns.map((column, index) => (
                                <DraggableColumn key={column.id} column={column} index={index} moveColumn={moveColumn} removeColumn={removeColumn} />
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
                                <DraggableSwimLane key={swimLane.id} swimLane={swimLane} index={index} moveSwimLane={moveSwimLane} removeSwimLane={removeSwimLane} />
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
            </div>
        </DndProvider>
    )
}
