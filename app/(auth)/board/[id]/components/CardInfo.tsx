import React from 'react'
import { useDrag } from 'react-dnd'
import { useCardModal } from './card-modal/useDialog'

interface CardProps {
    id: number
    title: string
}

const CardInfo: React.FC<CardProps> = ({ id, title }) => {
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
            {title}
        </button>
    )
}

export default CardInfo;
