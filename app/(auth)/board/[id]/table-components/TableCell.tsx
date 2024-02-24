import React from 'react'
import { useDrop } from 'react-dnd'

interface TableCellProps {
    onDrop: (item: { id: number; type: string }) => void
    children?: React.ReactNode,
    className?: string,
}

const TableCell: React.FC<TableCellProps> = ({ onDrop, children, className }) => {
    const [, drop] = useDrop({
        accept: 'div',
        drop: onDrop,
    })

    if (className === undefined) {
        className = "border-2 min-w-[220px] max-w-[400px] align-top p-1"
    }

    return (
        <td ref={drop}
            className={className}
        >
            <div className="min-h-[50px]">
                {children}
            </div>
        </td>
    )
}

export default TableCell;
