import React from 'react'
import { useDrag } from 'react-dnd'

interface CardProps {
    id: number
    title: string
}

const CardInfo: React.FC<CardProps> = ({ id, title }) => {
    const [, drag] = useDrag({
        type: 'div',
        item: { id },
    })

    return (
        <div ref={drag} style={{ border: '1px solid #ccc', padding: '8px', cursor: 'move' }}>
            {title}
        </div>
    )
}

export default CardInfo;
