import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import EditableText from './EditableText';

interface SwimLaneHeader {
    id: number;
    title: string;
}

interface DraggableSwimLaneProps {
    swimLane: SwimLaneHeader;
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
            <EditableText initialText={swimLane.title} type="SWIMLANE" id={swimLane.id} />
        </td>
    );
};