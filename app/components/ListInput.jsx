import { FaPenSquare } from "react-icons/fa";

const ListInput = ({ newItemHandler, placeholder }) => {
    const keyPressed = (e) => {
        if (e.keyCode === 13) {
            newItemHandler(e.target.value);
            e.target.value = '';
        }
    }

    return (
        <li className="list-group-item lighter">
            <FaPenSquare />
            &nbsp;
            <input placeholder={placeholder} className="input-box new-item-input" onKeyDown={keyPressed} />
        </li>
    )
};
export default ListInput;
