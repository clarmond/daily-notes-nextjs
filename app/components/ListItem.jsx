'use client';

// import DeleteButton from '../delete-button/delete-button.component';
// import EditButton from '../edit-button/edit-button.component';
import { useGlobalContext } from '@/context/GlobalContext';
import { FaStickyNote } from "react-icons/fa";

const ListItem = ({ id, defaultChecked, editable, text, note }) => {
    const checkboxID = `checkbox-${id}`;

    const { currentItems, setCurrentItems } = useGlobalContext();

    function markAsComplete() {
        const updatedItems = [...currentItems];
        updatedItems.map(item => {
            if (item._id === id) {
                item.is_completed = !item.is_completed;
            }
        });
        setCurrentItems(updatedItems);
    }

    return (
        <li key={id} className="list-group-item lighter">
            {note === 1 &&
                <FaStickyNote />
            }
            {note !== 1 &&
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
            {/* <DeleteButton id={id} /> */}
        </li>
    )
};

export default ListItem;
