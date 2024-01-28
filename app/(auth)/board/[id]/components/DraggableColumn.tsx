import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface ColumnHeader {
    id: number;
    title: string;
}

interface DraggableColumnProps {
    column: ColumnHeader;
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
            {column.title}
        </th>
    );
};