import React from 'react'
import { useDrop } from 'react-dnd'


interface TableCellProps {
    onDrop: (item: { id: number; type: string }) => void
    children?: React.ReactNode
}

const TableCell: React.FC<TableCellProps> = ({ onDrop, children }) => {
    const [, drop] = useDrop({
        accept: 'div',
        drop: onDrop,
    })

    return (
        <td ref={drop}
            className="border-2 min-w-[220px] max-w-[400px] align-top p-1"
        >
            <div className="min-h-[50px]">
                {children}
            </div>
        </td>
    )
}

export default TableCell;
