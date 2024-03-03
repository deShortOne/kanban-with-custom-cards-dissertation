import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import EditableText from './EditableText'
import { KanbanColumn, Role } from '@prisma/client'
import Image from 'next/image'

interface DraggableHeaderProps {
    item: {
        id: number;
        title: string;
        order: number;
        boardId: number;
    }
    index: number
    role: Role
    typeName: string
    moveHeader: (dragIndex: number, hoverIndex: number) => void
    removeHeader: (headerId: number, headerOrder: number) => void
}

export const DraggableHeader: React.FC<DraggableHeaderProps> = (
    { item, index, role, typeName, moveHeader, removeHeader }
) => {
    const [, ref] = useDrag({
        type: typeName,
        item: { index },
    })

    const [, drop] = useDrop({
        accept: typeName,
        hover: (item: { index: number }) => {
            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) {
                return;
            }

            moveHeader(dragIndex, hoverIndex)

            item.index = hoverIndex;
        },
    })

    const [canDrag, setDrag] = useState(true)

    return (
        <th
            ref={canDrag && role === Role.EDITOR ? (node) => ref(drop(node)) : null}
        >
            <div className="flex">
                <EditableText
                    headerItem={item}
                    type={typeName}
                    setDrag={setDrag}
                />
                {
                    role === Role.EDITOR &&
                    <button
                        onClick={() => removeHeader(item.id, index)}>
                        <Image src="/delete.svg" alt="remove header" width={24} height={24} />
                    </button>
                }
            </div>
        </th >
    )
}
