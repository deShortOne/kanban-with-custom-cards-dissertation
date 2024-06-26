import type { FC } from 'react'

import { Card } from '@/components/ui/card'
import { CardClassName, CardDisplay } from '../CardDisplay'

interface CardPropsLimited {
    id: number
    title: string
    cardTemplate: {
        cardType: {
            name: string
        }
    }
}

export const BoxDragPreview: FC<CardPropsLimited> = ({ id, title, cardTemplate }) => {
    return (
        <Card
            key={id}
            className={CardClassName + " rotate-6"}
        >
            <CardDisplay
                id={id}
                title={title}
                cardTemplate={cardTemplate}
                order={-2}
                swimLaneId={-2}
                columnId={-2}
            />
        </Card>
    )
}
