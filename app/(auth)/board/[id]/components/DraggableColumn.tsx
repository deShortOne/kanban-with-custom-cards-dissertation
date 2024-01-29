import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import EditableText from './EditableText';
import { KanbanColumn } from '@prisma/client';

interface DraggableColumnProps {
    column: KanbanColumn;
    index: number;
    moveColumn: (dragIndex: number, hoverIndex: number) => void;
}

export const DraggableColumn: React.FC<DraggableColumnProps> = ({ column, index, moveColumn }) => {
    const [, ref] = useDrag({
        type: 'COLUMN',
        item: { index },
    });

    const [, drop] = useDrop({
        accept: 'COLUMN',
        hover: (item: { index: number }) => {
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveColumn(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    });

    return (
        <th ref={(node) => ref(drop(node))}>
            <EditableText headerItem={column} type="COLUMN" />
        </th>
    );
};