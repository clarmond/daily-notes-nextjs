
import { useGlobalContext } from "@/context/GlobalContext";
import { FaTrash } from "react-icons/fa";

const DeleteItem = ({ id }) => {
    const { setCurrentId } = useGlobalContext();
    function setId() {
        setCurrentId(id);
    }
    return (
        <div className="align-self-end">
            <button
                aria-label="Remove this item"
                className="btn btn-danger"
                data-bs-toggle="modal" data-bs-target="#ConfirmDeleteModal"
                onClick={setId}
            >
                <FaTrash />
            </button>
        </div>
    );
}

export default DeleteItem;