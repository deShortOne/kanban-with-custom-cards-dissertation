import React from 'react'
import { useDrag } from 'react-dnd'
import { useCardModal } from './card-modal/useDialog'
import { User } from '@prisma/client'

interface CardProps {
    id: number
    title: string
    developer?: User
}

const CardInfo: React.FC<CardProps> = ({ id, developer, title }) => {
    const [, drag] = useDrag({
        type: 'div',
        item: { id },
    })

    const cardModal = useCardModal();

    return (
        <button
            onClick={() => cardModal.onOpen(id)}
            ref={drag}
            style={{ border: '1px solid #ccc', padding: '8px', cursor: 'move' }}
        >
            <h1 className="text-left">{title}</h1>
            <p className="text-left">{developer ? developer.email : "To be picked"}</p>
        </button>
    )
}

export default CardInfo;
