
import { useGlobalContext } from "@/context/GlobalContext";
import { FaTrash } from "react-icons/fa";

const DeleteItem = ({ id, action }) => {
    const { setCurrentId, setTaskType } = useGlobalContext();
    function setId() {
        setCurrentId(id);
        setTaskType(action === "saveBackburner" ? "backburner" : "regular");
    }
    return (
        <div className="align-self-end">
            <button
                aria-label="Remove this item"
                className="btn btn-danger btn-sm"
                data-bs-toggle="modal" data-bs-target="#ConfirmDeleteModal"
                onClick={setId}
            >
                <FaTrash />
            </button>
        </div>
    );
}

export default DeleteItem;