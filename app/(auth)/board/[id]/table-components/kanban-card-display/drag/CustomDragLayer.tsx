import type { XYCoord } from 'react-dnd'
import { useDragLayer } from 'react-dnd'

import { BoxDragPreview } from './BoxDragPreview'

function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null,
) {
    if (initialOffset == null || currentOffset == null) {
        return {
            display: 'none',
        }
    }

    let { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform,
    }
}

export const CustomDragLayer = () => {
    const { itemType, isDragging, item, initialOffset, currentOffset } =
        useDragLayer((monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
        }))

    function renderItem() {
        switch (itemType) {
            case "div":
                return <BoxDragPreview
                    id={item.id}
                    title={item.title}
                    cardTemplate={item.cardTemplate}
                />
            default:
                return null
        }
    }

    if (!isDragging) {
        return null
    }
    return (
        <div className='fixed pointer-events-none left-0 top-0 w-full h-full z-10'>
            <div
                // have to use style here as tailwind cannot transform both x and y at the same time...
                style={getItemStyles(initialOffset, currentOffset)}
            >
                {renderItem()}
            </div>
        </div>
    )
}
