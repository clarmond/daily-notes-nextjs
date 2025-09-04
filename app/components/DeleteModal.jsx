'use client';

import { useGlobalContext } from "@/context/GlobalContext";
import { deleteItem } from "../actions/tasks";

const DeleteModal = () => {
    const { currentId, currentItems, setCurrentItems } = useGlobalContext();

    async function deleteAction() {
        await deleteItem(currentId);

        const updatedItems = [...currentItems].filter(item => item._id != currentId);
        setCurrentItems(updatedItems);
    }

    return (
        <div className="modal" tabIndex="-1" role="dialog" id="ConfirmDeleteModal" aria-hidden="true" aria-label="Delete Item?">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Item?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this item?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={deleteAction} data-bs-dismiss="modal">Delete</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;