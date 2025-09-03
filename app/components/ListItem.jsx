// import DeleteButton from '../delete-button/delete-button.component';
// import EditButton from '../edit-button/edit-button.component';
import { FaStickyNote } from "react-icons/fa";

const ListItem = ({ id, defaultChecked, editable, text, note }) => {
    const checkboxID = `checkbox-${id}`;
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
                />
            }
            &nbsp;
            <label htmlFor={checkboxID}>{text}</label>
            {/* <DeleteButton id={id} /> */}
        </li>
    )
};

export default ListItem;
