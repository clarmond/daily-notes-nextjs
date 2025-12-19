'use client';

import DeleteItem from './DeleteItem';
import TransferItem from './TransferItem';
// import EditButton from '../edit-button/edit-button.component';
import { useGlobalContext } from '@/context/GlobalContext';
import { FaStickyNote } from "react-icons/fa";
import { updateCompletion } from '../actions/tasks';
import { updateBackburnerCompletion } from '../actions/backburnerTasks';

const ListItem = ({ id, defaultChecked, editable, text, note, showTimestamps, timestamp, backburnerItems, setBackburnerItems, action, noWrapper }) => {
    const checkboxID = `checkbox-${id}`;

    const { currentItems, setCurrentItems } = useGlobalContext();

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
                <div className="w-100">
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
                    &nbsp;
                    <label htmlFor={checkboxID}>{text}</label>
                </div>
                {editable && (
                    <div className="d-flex gap-2">
                        {action !== "saveNote" && (
                            <TransferItem
                                id={id}
                                action={action}
                                backburnerItems={backburnerItems}
                                setBackburnerItems={setBackburnerItems}
                            />
                        )}
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
