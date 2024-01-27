import React from 'react'
import { useDrag } from 'react-dnd'

interface CardProps {
    id: number
    text: string
}

const Card: React.FC<CardProps> = ({ id, text }) => {
    const [, drag] = useDrag({
        type: 'div',
        item: { id },
    })

    return (
        <div ref={drag} style={{ border: '1px solid #ccc', padding: '8px', cursor: 'move' }}>
            {text}
        </div>
    )
}

export default Card;
