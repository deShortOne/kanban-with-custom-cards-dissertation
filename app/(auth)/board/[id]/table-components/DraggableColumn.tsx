import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import EditableText from './EditableText'
import { KanbanColumn } from '@prisma/client'

interface DraggableColumnProps {
    column: KanbanColumn,
    index: number,
    moveColumn: (dragIndex: number, hoverIndex: number) => void,
    removeColumn: (columnId: number, columnOrder: number) => void,
}

export const DraggableColumn: React.FC<DraggableColumnProps> = ({ column, index, moveColumn, removeColumn }) => {
    const [, ref] = useDrag({
        type: 'COLUMN',
        item: { index },
    })

    const [, drop] = useDrop({
        accept: 'COLUMN',
        hover: (item: { index: number }) => {
            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) {
                return;
            }

            moveColumn(dragIndex, hoverIndex)

            item.index = hoverIndex;
        },
    })

    const [canDrag, setDrag] = useState(true)

    return (
        <th ref={canDrag ? (node) => ref(drop(node)) : null}>
            <div className="flex">
                <EditableText headerItem={column} type="COLUMN" setDrag={setDrag} />
                <button onClick={() => removeColumn(column.id, index)}>
                    <img src="/delete.svg" />
                </button>
            </div>
        </th>
    )
}