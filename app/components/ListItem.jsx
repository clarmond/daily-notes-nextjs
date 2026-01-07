'use client';

import { useState } from 'react';
import DeleteItem from './DeleteItem';
import TransferItem from './TransferItem';
// import EditButton from '../edit-button/edit-button.component';
import { useGlobalContext } from '@/context/GlobalContext';
import { useToast } from '@/context/ToastContext';
import { FaStickyNote, FaPencilAlt } from "react-icons/fa";
import { updateCompletion, updateTaskText } from '../actions/tasks';
import { updateBackburnerCompletion } from '../actions/backburnerTasks';

const ListItem = ({ id, defaultChecked, editable, text, note, showTimestamps, timestamp, backburnerItems, setBackburnerItems, action, noWrapper }) => {
    const checkboxID = `checkbox-${id}`;

    const { currentItems, setCurrentItems } = useGlobalContext();
    const { showToast } = useToast();

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);
    const [isSaving, setIsSaving] = useState(false);

    // Edit handlers
    const handleEditClick = () => {
        setIsEditing(true);
        setEditText(text);
    };

    const handleDoubleClick = () => {
        if (editable) {
            handleEditClick();
        }
    };

    const handleCancel = () => {
        setEditText(text);
        setIsEditing(false);
    };

    const handleSave = async () => {
        const trimmedText = editText.trim();

        // Validation
        if (trimmedText === '') {
            showToast('Task text cannot be empty', 'error');
            return;
        }

        if (trimmedText === text) {
            // No change, just exit edit mode
            setIsEditing(false);
            return;
        }

        // Prevent duplicate saves
        if (isSaving) return;

        setIsSaving(true);

        try {
            await updateTaskText(id, trimmedText);

            // Update local state - follow existing pattern
            if (action === "saveBackburner") {
                const updatedItems = [...backburnerItems];
                updatedItems.forEach((item) => {
                    if (item._id === id) {
                        item.text = trimmedText;
                    }
                });
                setBackburnerItems(updatedItems);
            } else {
                const updatedItems = [...currentItems];
                updatedItems.forEach((item) => {
                    if (item._id === id) {
                        item.text = trimmedText;
                    }
                });
                setCurrentItems(updatedItems);
            }

            setIsEditing(false);
            showToast('Task updated successfully', 'success');
        } catch (error) {
            console.error('Error updating task:', error);
            showToast('Failed to update task. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleBlur = async () => {
        // Save on blur (clicking outside)
        await handleSave();
    };

    async function markAsComplete() {
        if (action === "saveBackburner") {
            // Handle backburner tasks
            const updatedItems = [...backburnerItems];
            updatedItems.map(async (item) => {
                if (item._id === id) {
                    item.is_completed = !item.is_completed;
                    await updateBackburnerCompletion(id, item.is_completed);
                }
            });
            setBackburnerItems(updatedItems);
        } else {
            // Handle regular tasks
            const updatedItems = [...currentItems];
            updatedItems.map(async (item) => {
                if (item._id === id) {
                    item.is_completed = !item.is_completed;
                    await updateCompletion(id, item.is_completed);
                }
            });
            setCurrentItems(updatedItems);
        }
    }

    const content = (
        <>
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-start w-100 pe-2">
                    <span className="flex-shrink-0 me-2">
                        {note === true &&
                            <FaStickyNote />
                        }
                        {note !== true &&
                            <input
                                id={checkboxID}
                                type="checkbox"
                                defaultChecked={defaultChecked}
                                disabled={!editable}
                                onChange={markAsComplete}
                            />
                        }
                    </span>
                    {isEditing ? (
                        <input
                            type="text"
                            className="form-control form-control-sm flex-grow-1"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            autoFocus
                            disabled={isSaving}
                        />
                    ) : (
                        <label
                            htmlFor={checkboxID}
                            className="flex-grow-1"
                            onDoubleClick={handleDoubleClick}
                            style={{ cursor: editable ? 'text' : 'default' }}
                        >
                            {text}
                        </label>
                    )}
                </div>
                {editable && !isEditing && (
                    <div className="d-flex gap-2">
                        {action !== "saveNote" && (
                            <TransferItem
                                id={id}
                                action={action}
                                backburnerItems={backburnerItems}
                                setBackburnerItems={setBackburnerItems}
                            />
                        )}
                        <div className="align-self-end">
                            <button
                                aria-label="Edit this task"
                                className="btn btn-primary btn-sm"
                                onClick={handleEditClick}
                            >
                                <FaPencilAlt />
                            </button>
                        </div>
                        <DeleteItem id={id} action={action} />
                    </div>
                )}
            </div>
            {
                showTimestamps &&
                <div className="timestamp">{timestamp.toLocaleString()}</div>
            }
            {/* <DeleteButton id={id} /> */}
        </>
    );

    if (noWrapper) {
        return content;
    }

    return (
        <li key={id} className="list-group-item lighter">
            {content}
        </li>
    );
};

export default ListItem;
