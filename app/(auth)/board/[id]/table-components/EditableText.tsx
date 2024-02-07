import React, { useState } from 'react';

interface prop {
    headerItem: header,
    type: string
}

type header = {
    id: number;
    title: string;
    order: number;
    boardId: number;
}

const EditableText = ({ headerItem, type }: prop) => {
    const [isEditing, setIsEditing] = useState(headerItem.id === -1);
    const [text, setText] = useState(headerItem.title);

    const handleDoubleClick = () => {
        setIsEditing(true);
    }
    const handleChange = (event) => {
        setText(event.target.value);
    }
    const handleBlur = async () => {
        setIsEditing(false);
        await fetch('/api/headers/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newText: text,
                type: type,
                id: headerItem.id,
                order: headerItem.order,
                boardId: headerItem.boardId
            }),
        });
    }

    return (
        <div onDoubleClick={handleDoubleClick}>
            {isEditing ? (
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            ) : (
                <span>{text}</span> // set font
            )}
        </div>
    )
}

export default EditableText;
