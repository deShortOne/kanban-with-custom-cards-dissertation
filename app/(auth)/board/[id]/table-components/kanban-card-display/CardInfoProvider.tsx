"use client"

import { useEffect, useState } from "react"
import CardInfo from "./CardInfo"
import { CardProps } from "../Table"

export interface CardPropExtra extends CardProps {
    moveCard: (dragIndex: number, hoverIndex: number) => void
}

export const CardInfoProvider: React.FC<CardPropExtra> = (
    { id, title, cardTemplate, order, columnId, swimLaneId, moveCard }
) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <CardInfo id={id}
            title={title}
            cardTemplate={cardTemplate}
            order={order}
            moveCard={moveCard}
            columnId={columnId}
            swimLaneId={swimLaneId}
        />
    )
}
