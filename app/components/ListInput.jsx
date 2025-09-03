'use client';

import { FaPenSquare } from "react-icons/fa";
import { saveNewTask } from "../actions/tasks";

const ListInput = ({ placeholder, action }) => {
    const keyPressed = async (e) => {
        if (e.keyCode === 13) {
            if (action === 'saveNew') {
                saveNewTask(e.target.value);
            }
            e.target.value = '';
        }
    }

    return (
        <li className="list-group-item lighter">
            <FaPenSquare />
            &nbsp;
            <input placeholder={placeholder} className="input-box new-item-input" onKeyUp={keyPressed} />
        </li>
    )
};
export default ListInput;
