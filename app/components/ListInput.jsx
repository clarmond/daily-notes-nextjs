'use client';

import { FaPenSquare } from "react-icons/fa";
import { saveNewTask } from "../actions/tasks";
import { useGlobalContext } from '@/context/GlobalContext';

const ListInput = ({ placeholder, action }) => {
    const { currentItems, setCurrentItems } = useGlobalContext();

    const keyPressed = async (e) => {
        if (e.keyCode === 13 && !e.altKey) {
            let is_completed = false;
            let is_note = false;
            if (action === 'saveNote') {
                is_completed = true;
                is_note = true;
            }
            const results = await saveNewTask(e.target.value);
            const updatedItems = [...currentItems, JSON.parse(results)];
            setCurrentItems(updatedItems);
            e.target.value = '';
        }
    }

    return (
        <li className="list-group-item lighter">
            <div className="d-flex align-items-top">
                <div>
                    <FaPenSquare />
                </div>
                <div className="flex-grow-1">
                    <input placeholder={placeholder} className="input-box new-item-input" onKeyUp={keyPressed} />
                </div>
            </div>
        </li>
    )

}

export default ListInput;
