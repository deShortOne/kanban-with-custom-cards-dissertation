import React from 'react'
import { useDrag } from 'react-dnd'
import { useCardModal } from './card-modal/useDialog'
import { User } from '@prisma/client'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
        <Card
            onClick={() => cardModal.onOpen(id)}
            ref={drag}
            className="border-solit border-2 border-[#ccc] cursor-move w-[200px] h-[100px] m-1"
        >
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{developer ? developer.email : "No developer"}</CardDescription>
            </CardHeader>

        </Card>
    )
}

export default CardInfo;
