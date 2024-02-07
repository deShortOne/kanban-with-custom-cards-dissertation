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
        <td ref={drop} style={{ border: '1px solid #ccc', padding: '8px' }}>
            {children}
        </td>
    )
}

export default TableCell;
