'use client'
import { KanbanColumn, KanbanSwimLane, Role } from "@prisma/client"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React, { useEffect, useRef, useState } from 'react'
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
    useQueryClient,
} from '@tanstack/react-query'
import { BoardApiData, BoardHeaderType, CardProps } from "@/app/types/Board"

interface TableInformationProps {
    id: number
    role: Role

    cards: CardProps[]
    kanbanColumns: KanbanColumn[]
    kanbanSwimLanes: KanbanSwimLane[]
    lastKanbanUpdate: number
}

function sortCardPropsByOrder(a: CardProps, b: CardProps) {
    return a.order - b.order
}

export const Table = ({
    id, role, cards, kanbanColumns, kanbanSwimLanes, lastKanbanUpdate
}: TableInformationProps) => {
    const boardId = id
    const queryClient = useQueryClient()
    const LastKanbanUpdateServer = useRef(lastKanbanUpdate);

    const [alertMsg, setAlertMsg] = useState("")
    const [alertMsgOpen, setAlertMsgOpen] = useState(false)

    const { status, data, error, isFetching } = useQuery<BoardApiData>({
        queryKey: ['todos'],
        queryFn: () => (fetch('/api/board?' +
            new URLSearchParams({
                "kanbanId": boardId.toString(),
                "lastKanbanUpdate": LastKanbanUpdateServer.current.toString(),
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())),
        staleTime: 10000,
        // Refetch the data every 5 seconds
        refetchInterval: 5000,
    })
    useEffect(() => {
        if (isFetching)
            return
        if (!data)
            return
        if (data.updateCardPositions)
            setCard(data.cards)
        if (data.updateColumnPositions)
            setColumns(data.kanbanColumns)
        if (data.updateSwimLanePositions)
            setSwimLanes(data.kanbanSwimLanes)
        if (data.updateCardTemplates)
            queryClient.invalidateQueries({ queryKey: ["addNewCard"] })
        if (data.updateCardData) {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'card' && data.updatedCardIds.findIndex(i => i === query.queryKey[1]) !== -1
            })
        }

        LastKanbanUpdateServer.current = data.lastKanbanUpdate
    }, [isFetching, data, queryClient])

    /* COLUMN */
    // move column
    const [stateColumns, setColumns] = useState<KanbanColumn[]>(kanbanColumns)
    const moveColumn = (dragIndex: number, hoverIndex: number) => {
        const draggedColumn = stateColumns[dragIndex]
        const newColumns = [...stateColumns]
        newColumns.splice(dragIndex, 1)
        newColumns.splice(hoverIndex, 0, draggedColumn)

        setColumns(newColumns)

        moveHeader(boardId, "COLUMN", newColumns.map(cell => cell.id))
    }

    // add column
    const addColumn = async () => {
        const newColumns = [...stateColumns]
        newColumns.push({
            id: await addHeaderAndGetId(boardId, "COLUMN", stateColumns.length + 1),
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
            removeHeader(boardId, "COLUMN", headerId)
        } else {
            setAlertMsg("Remove all cards from this column")
            setAlertMsgOpen(true)
        }
    }

    /* SWIM LANE */
    // move swim lane
    const [stateSwimLanes, setSwimLanes] = useState<KanbanSwimLane[]>(kanbanSwimLanes)
    const moveSwimLane = (dragIndex: number, hoverIndex: number) => {
        const draggedSwimLane = stateSwimLanes[dragIndex]
        const newSwimLanes = [...stateSwimLanes]
        newSwimLanes.splice(dragIndex, 1)
        newSwimLanes.splice(hoverIndex, 0, draggedSwimLane)

        setSwimLanes(newSwimLanes)

        moveHeader(boardId, "SWIMLANE", newSwimLanes.map(cell => cell.id))
    }

    // add swim lane
    const addSwimLane = async () => {
        const draggedSwimLane = [...stateSwimLanes]
        draggedSwimLane.push({
            id: await addHeaderAndGetId(boardId, "SWIMLANE", stateSwimLanes.length + 1),
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
            removeHeader(boardId, "SWIMLANE", headerId)
        } else {
            setAlertMsg("Remove all cards from this swim lane")
            setAlertMsgOpen(true)
        }
    }

    /* CARD */
    // move card
    const [cardsInfo, setCard] = useState<CardProps[]>(cards)
    const [dragCardId, setDragCardId] = useState<number>(-1)
    const handleCardDrop = (cardId: number, columnId: number, rowId: number) => {
        fetch('/api/card/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cardList: cardsInfo.map(i => ({
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
        if (cardModal.deletedId !== -1) {
            removeCard(cardModal.deletedId)
            cardModal.setDeletedId(-1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardModal.deletedId])

    return (
        <div>
            <AlertDialog open={alertMsgOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error!</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertMsg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAlertMsgOpen(false)}>
                            Ok
                        </AlertDialogAction>
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
                                            {cardsInfo
                                                .filter(card => card.columnId === -1
                                                    && card.swimLaneId === -1)
                                                .map((card) =>
                                                    <CardInfoProvider
                                                        {...card}
                                                        key={card.id}
                                                        moveCard={moveCard}
                                                        dragCardId={dragCardId}
                                                        setDragCardId={setDragCardId}
                                                    />
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
                                                {cardsInfo
                                                    .filter(card => card.columnId === cell.id
                                                        && card.swimLaneId === swimLane.id)
                                                    .map((card) =>
                                                        <CardInfoProvider
                                                            {...card}
                                                            key={card.id}
                                                            moveCard={moveCard}
                                                            dragCardId={dragCardId}
                                                            setDragCardId={setDragCardId}
                                                        />
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
        </div >
    )
}

function moveHeader(boardId: number, type: BoardHeaderType, headers: number[]) {
    fetch('/api/headers/reorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            boardId: boardId,
            type: type,
            headers: headers
        }),
    })
}

async function addHeaderAndGetId(boardId: number, type: BoardHeaderType, order: number) {
    const data = await fetch('/api/headers/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: type,
            order: order,
            boardId: boardId,
        }),
    })

    return await data.json()
}

function removeHeader(boardId: number, type: BoardHeaderType, headerId: number) {
    fetch('/api/headers/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: headerId,
            type: type,
            boardId: boardId,
        }),
    })
}
