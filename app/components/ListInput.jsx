'use client';

import { FaPenSquare } from "react-icons/fa";
import { saveNewTask } from "../actions/tasks";
import { useGlobalContext } from '@/context/GlobalContext';

const ListInput = ({ placeholder, action }) => {
    const { currentItems, setCurrentItems } = useGlobalContext();

    const keyPressed = async (e) => {
        if (e.keyCode === 13) {
            if (action === 'saveNew') {
                const results = await saveNewTask(e.target.value);
                const updatedItems = [...currentItems, JSON.parse(results)];
                setCurrentItems(updatedItems);
                e.target.value = '';
            }
        }
    }

    return (
        <li className="list-group-item lighter">
            <FaPenSquare />
            &nbsp;
            <input placeholder={placeholder} className="input-box new-item-input" onKeyUp={keyPressed} />
        </li>
    )

}

export default ListInput;
