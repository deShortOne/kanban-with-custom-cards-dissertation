import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

interface prop {
    headerItem: header,
    type: string,
    setDrag: React.Dispatch<React.SetStateAction<boolean>>
}

type header = {
    id: number;
    title: string;
    order: number;
    boardId: number;
}

const EditableText = ({ headerItem, type, setDrag }: prop) => {
    const [isEditing, setIsEditing] = useState(headerItem.id === -1);
    const [text, setText] = useState(headerItem.title);

    const handleDoubleClick = () => {
        setDrag(false)
        setIsEditing(true)
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }
    const handleBlur = async () => {
        setDrag(true)
        setIsEditing(false)
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
                <Input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="text-lg"
                />
            ) : (
                <Label className="text-lg cursor-move">{text}</Label>
            )}
        </div>
    )
}

export default EditableText;
