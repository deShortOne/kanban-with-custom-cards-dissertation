import React from 'react'
import { useDrag } from 'react-dnd'
import { useCardModal } from './card-modal/useDialog'
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CardProps {
    id: number
    title: string
    cardTemplate: {
        cardType: {
            id: number
            name: string
        }
    }
}

const CardInfo: React.FC<CardProps> = ({ id, title, cardTemplate }) => {
    const [, drag] = useDrag({
        type: 'div',
        item: { id },
    })

    const cardModal = useCardModal()

    return (
        <Card
            onClick={() => cardModal.onOpen(id)}
            ref={drag}
            className="border-solit border-2 border-[#ccc] cursor-move w-[200px] h-[100px] m-1"
        >
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <Badge className="max-h-[24px]" variant="outline">{cardTemplate.cardType.name}</Badge>
                </div>
            </CardHeader>

        </Card>
    )
}

export default CardInfo;
