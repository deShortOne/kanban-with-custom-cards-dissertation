import React, { useState } from 'react';

const EditableText = ({ initialText, type, id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    const handleDoubleClick = () => {
        setIsEditing(true);
    }
    const handleChange = (event) => {
        setText(event.target.value);
    }
    const handleBlur = async () => {
        setIsEditing(false);
        await fetch('/api/updateHeaders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newText: text,
                type: type,
                id: id
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
