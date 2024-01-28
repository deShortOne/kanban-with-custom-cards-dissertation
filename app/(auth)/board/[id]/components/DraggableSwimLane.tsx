import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import EditableText from './EditableText';
import { KanbanSwimLane } from '@prisma/client';

interface DraggableSwimLaneProps {
    swimLane: KanbanSwimLane;
    index: number;
    moveSwimLane: (dragIndex: number, hoverIndex: number) => void;
}

export const DraggableSwimLane: React.FC<DraggableSwimLaneProps> = ({ swimLane, index, moveSwimLane }) => {
    const [, ref] = useDrag({
        type: 'SWIMLANE',
        item: { index },
    });

    const [, drop] = useDrop({
        accept: 'SWIMLANE',
        hover: (item: { index: number }) => {
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveSwimLane(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    });

    return (
        <td ref={(node) => ref(drop(node))}>
            <EditableText headerItem={swimLane} type="SWIMLANE" />
        </td>
    );
};