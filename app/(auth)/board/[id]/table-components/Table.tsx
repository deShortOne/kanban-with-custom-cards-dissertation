'use client'
import { KanbanColumn, KanbanSwimLane, Role } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useEffect, useState } from 'react'
import TableCell from './TableCell'

import { AddNewCardButton } from "./NewCardButton"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCardModal } from "./card-modal/useDialog"
import { CustomDragLayer } from "./kanban-card-display/drag/CustomDragLayer"
import { CardInfoProvider } from "./kanban-card-display/CardInfoProvider"
import { DraggableHeader } from "./DraggableHeader"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    useQuery,
} from '@tanstack/react-query'
import { BoardApiData, CardProps } from "@/app/types/Board"

interface TableInformationProps {
    id: number
    role: Role
}

function sortCardPropsByOrder(a: CardProps, b: CardProps) {
    return a.order - b.order
}

export const Table = ({
    id, role
}: TableInformationProps) => {
    const boardId = id
    let LastKanbanUpdateServer = 0

    const [alertMsg, setAlertMsg] = useState("")

    const { status, data, error, isFetching } = useQuery<BoardApiData>({
        queryKey: ['todos'],
        queryFn: () => (fetch('/api/board?' +
            new URLSearchParams({
                "kanbanId": boardId.toString(),
                "lastKanbanUpdate": LastKanbanUpdateServer.toString(),
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())),
        // Refetch the data every 5 seconds
        refetchInterval: 5000,
    })
    useEffect(() => {
        if (isFetching)
            return
        if (!data)
            return
        if (data.updateCardPositions)
            setCard(data.Cards)
        if (data.updateColumnPositions)
            setColumns(data.KanbanColumns)
        if (data.updateSwimLanePositions)
            setSwimLanes(data.KanbanSwimLanes)

        LastKanbanUpdateServer = data.LastKanbanUpdate
    }, [isFetching, data])

    /* COLUMN */
    // move column
    const [stateColumns, setColumns] = useState<KanbanColumn[]>([])
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
    const removeColumn = async (headerId: number, headerOrder: number) => {
        let hasNoCards = cardsInfo.findIndex(card => card.columnId === headerId) === -1
        if (hasNoCards) {
            const newColumns = [...stateColumns]

            newColumns.splice(headerOrder, 1)
            setColumns(newColumns)

            fetch('/api/headers/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: headerId,
                    type: "COLUMN",
                    boardId: boardId,
                }),
            })
        } else {
            setAlertMsg("Remove all cards from this column")
        }
    }

    /* SWIM LANE */
    // move swim lane
    const [stateSwimLanes, setSwimLanes] = useState<KanbanSwimLane[]>([])
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
    const removeSwimLane = async (headerId: number, headerOrder: number) => {
        let hasNoCards = cardsInfo.findIndex(card => card.swimLaneId === headerId) === -1
        if (hasNoCards) {
            const newSwimLane = [...stateSwimLanes]

            newSwimLane.splice(headerOrder, 1)
            setSwimLanes(newSwimLane)

            fetch('/api/headers/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: headerId,
                    type: "SWIMLANE",
                    boardId: boardId,
                }),
            })
        } else {
            setAlertMsg("Remove all cards from this swim lane")
        }
    }

    /* CARD */
    // move card
    const [cardsInfo, setCard] = useState<CardProps[]>([])
    const [dragCardId, setDragCardId] = useState<number>(-1)
    const handleCardDrop = (cardId: number, columnId: number, rowId: number) => {

        const lisOfCardsInCell = cardsInfo.filter(i => i.columnId === columnId && i.swimLaneId === rowId)
        const orderIds = new Set(lisOfCardsInCell)

        let orderPos: number;
        if (lisOfCardsInCell.length === 0) {
            orderPos = 1
        } else if (lisOfCardsInCell.length !== orderIds.size) {
            orderPos = lisOfCardsInCell.length + 1
        } else {
            orderPos = (cardsInfo.find(i => i.id === cardId) as CardProps).order
        }

        const updatedCard = cardsInfo.map((card) =>
            card.id === cardId ? { ...card, columnId: columnId, swimLaneId: rowId, order: orderPos } : card
        )

        updatedCard.sort(sortCardPropsByOrder)
        setCard(updatedCard)
        setDragCardId(-1)

        fetch('/api/card/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cardList: updatedCard.map(i => ({
                    id: i.id,
                    title: i.title,
                    columnId: i.columnId,
                    swimLaneId: i.swimLaneId,
                    order: i.order,
                }))
            }),
        })
    }

    // dest card is the card that is being hovered over
    const moveCard = (sourceCardId: number, destCardId: number) => {
        const prevCards = [...cardsInfo]
        const sourcePos = prevCards.findIndex(i => i.id === sourceCardId)

        const destPos = prevCards.find(i => i.id === destCardId) as CardProps
        const destCol = destPos.columnId
        const destSwim = destPos.swimLaneId

        if (prevCards[sourcePos].columnId === destCol &&
            prevCards[sourcePos].swimLaneId === destSwim) {
            const tmpPos = prevCards[sourcePos].order
            prevCards[sourcePos].order = destPos.order
            destPos.order = tmpPos
        } else {
            prevCards[sourcePos] = {
                ...prevCards[sourcePos],
                columnId: destCol,
                swimLaneId: destSwim,
                order: destPos.order - 0.5,
            }
        }

        const lisOfCardsInCell = prevCards.filter(i => i.columnId === destCol && i.swimLaneId === destSwim)
        lisOfCardsInCell.sort(sortCardPropsByOrder)
        for (let i = 0; i < lisOfCardsInCell.length; i++) {
            lisOfCardsInCell[i].order = i + 1
        }
        prevCards.sort(sortCardPropsByOrder)

        setCard(prevCards)
    }

    // for table cell detection
    const moveCardCell = (cardId: number, columnId: number, swimLaneId: number) => {
        const prevCards = [...cardsInfo]
        const card = prevCards.find(i => i.id === cardId) as CardProps
        if (card.columnId === columnId && card.swimLaneId === swimLaneId) {
            return
        }

        card.columnId = columnId
        card.swimLaneId = swimLaneId
        card.order = prevCards.reduce(
            (acc, item) => acc + (
                (item.columnId === columnId && item.swimLaneId === swimLaneId) ? 1 : 0
            )
            , 0) + 1

        setCard(prevCards)
    }

    // new card
    const addCard = async (cardTemplateId: number, cardTypeName: string) => {
        const orderPos = cardsInfo.filter(i => i.columnId === -1).length + 1
        const response = await fetch('/api/card/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order: orderPos,
                boardId: boardId,
                cardTemplateId: cardTemplateId,
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
            cardTemplate: {
                cardType: {
                    name: cardTypeName
                }
            }
        } as CardProps)
        setCard(updatedCards)
    }

    // remove card
    const removeCard = async (cardTypeId: number) => {
        if (cardTypeId === -1)
            return
        fetch("/api/card/remove", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cardId: cardTypeId,
            }),
        })

        const updatedCards = [...cardsInfo].filter(i => i.id !== cardTypeId)
        setCard(updatedCards)
    }

    // tracks changes from cardModal hook
    const cardModal = useCardModal()
    useEffect(() => {
        removeCard(cardModal.deletedId)
        cardModal.setDeletedId(-1)
    }, [cardModal.deletedId])

    return (
        <div>
            <AlertDialog open={alertMsg !== ""}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error!</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertMsg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => { setAlertMsg("") }}>Ok</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DndProvider backend={HTML5Backend}>
                <CustomDragLayer key={new Date().getTime()} />
                <div className="flex min-h-[85vh] h-5 space-x-4">
                    <div>
                        <AddNewCardButton
                            kanbanId={boardId}
                            role={role}
                            newCardAction={addCard} />
                        <ScrollArea className="h-[80vh] w-full rounded-md border">
                            <table>
                                <tbody>
                                    <tr>
                                        <TableCell
                                            onDrop={(item) => handleCardDrop(item.id, -1, -1)}
                                            onHover={(item) => moveCardCell(item.id, -1, -1)}
                                            key={"-1 -1"}
                                            className="absolute h-full min-w-[220px] max-w-[400px] align-top p-1"
                                        >
                                            {cardsInfo.map((card) =>
                                                card.columnId === -1 && card.swimLaneId === -1 ? (
                                                    <CardInfoProvider
                                                        {...card}
                                                        key={card.id}
                                                        moveCard={moveCard}
                                                        dragCardId={dragCardId}
                                                        setDragCardId={setDragCardId}
                                                    />
                                                ) : null
                                            )}
                                        </TableCell>
                                    </tr>
                                </tbody>
                            </table>
                        </ScrollArea>
                    </div>

                    <Separator orientation="vertical" />

                    <ScrollArea className="h-[87vh] w-full">
                        <table className="table-fixed">
                            <thead>
                                <tr>
                                    <th />
                                    {stateColumns.map((column, index) => (
                                        <DraggableHeader
                                            key={column.id}
                                            item={column}
                                            index={index}
                                            role={role}
                                            typeName="COLUMN"
                                            moveHeader={moveColumn}
                                            removeHeader={removeColumn}
                                        />
                                    ))}
                                    {
                                        role === "EDITOR" &&
                                        <th>
                                            <button
                                                type="button"
                                                onClick={addColumn}
                                            >
                                                Add new
                                            </button>
                                        </th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {stateSwimLanes.map((swimLane, index) => (
                                    <tr key={swimLane.id} className="min-w-[100px]">
                                        <DraggableHeader
                                            key={swimLane.id}
                                            item={swimLane}
                                            index={index}
                                            role={role}
                                            typeName="SWIMLANE"
                                            moveHeader={moveSwimLane}
                                            removeHeader={removeSwimLane}
                                        />
                                        {stateColumns.map((cell) => (
                                            <TableCell
                                                onDrop={(item) => handleCardDrop(item.id, cell.id, swimLane.id)}
                                                onHover={(item) => moveCardCell(item.id, cell.id, swimLane.id)}
                                                key={cell.id + " " + swimLane.id}
                                            >
                                                {cardsInfo.map((card) =>
                                                    card.columnId === cell.id && card.swimLaneId === swimLane.id ? (
                                                        <CardInfoProvider
                                                            {...card}
                                                            key={card.id}
                                                            moveCard={moveCard}
                                                            dragCardId={dragCardId}
                                                            setDragCardId={setDragCardId}
                                                        />
                                                    ) : null
                                                )}
                                            </TableCell>
                                        ))}
                                    </tr>
                                ))}
                                {
                                    role === "EDITOR" &&
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
                                }
                            </tbody>
                        </table>
                        <div />
                    </ScrollArea>
                </div>
            </DndProvider>
        </div>
    )
}
