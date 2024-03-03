import React, { useEffect, useRef } from 'react'
import { XYCoord, useDrag, useDrop } from 'react-dnd'
import { useCardModal } from '../card-modal/useDialog'
import { Card } from "@/components/ui/card"
import { getEmptyImage } from 'react-dnd-html5-backend'
import { CardClassName, CardDisplay } from './CardDisplay'
import { CardPropExtra } from './CardInfoProvider'

const CardInfo: React.FC<CardPropExtra> = (
    { id, title, cardTemplate, order, columnId, swimLaneId,
        moveCard, dragCardId, setDragCardId }
) => {
    const ref = useRef<HTMLDivElement>(null)
    const [{ handlerId }, drop] = useDrop({
        accept: 'div',
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId(),
        }),
        hover(item: any, monitor) {
            if (!ref.current) {
                return
            }

            if (item.swimLaneId === swimLaneId && item.columnId === columnId) {
                // Determine rectangle on screen
                const hoverBoundingRect = ref.current?.getBoundingClientRect()

                // Get vertical middle
                const hoverMiddleY =
                    (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

                // Determine mouse position
                const clientOffset = monitor.getClientOffset()

                // Get pixels to the top
                const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

                // Only perform the move when the mouse has crossed half of the items height
                // When dragging downwards, only move when the cursor is below 50%
                // When dragging upwards, only move when the cursor is above 50%

                // Dragging downwards
                if (item.order < order && hoverClientY < hoverMiddleY) {
                    return
                }
                // Dragging upwards
                if (item.order > order && hoverClientY > hoverMiddleY) {
                    return
                }
            }

            moveCard(item.id, id)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            const tmp = item.order
            item.order = order
            order = tmp
        },
    })

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'div',
        item: { id, title, cardTemplate, order, columnId, swimLaneId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: () => {
            setDragCardId(-1)
        },
    }), [id, title, cardTemplate])

    const cardModal = useCardModal()

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    })

    useEffect(() => {
        if (isDragging) {
            setDragCardId(id)
        }
    }, [isDragging, setDragCardId, id])

    drag(drop(ref))
    return (
        <Card
            onClick={() => cardModal.onOpen(id)}
            ref={ref}
            className={CardClassName + (isDragging || dragCardId === id ? " opacity-20" : "")}
            key={id}
        >
            <CardDisplay
                id={id}
                title={title}
                cardTemplate={cardTemplate}
                order={order}
                data-handler-id={handlerId}
                columnId={columnId}
                swimLaneId={swimLaneId}
            />
        </Card>
    )
}

export default CardInfo;
