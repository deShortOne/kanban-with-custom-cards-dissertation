import React from 'react'
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

    return (
        <th ref={(node) => ref(drop(node))}>
            <div className="flex">
                <EditableText headerItem={column} type="COLUMN" />
                <button onClick={() => removeColumn(column.id, index)}>
                    <img src="/delete.svg" />
                </button>
            </div>
        </th>
    )
}