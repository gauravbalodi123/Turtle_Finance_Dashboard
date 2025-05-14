import React, { Fragment, useRef, useEffect } from "react";

const EditModal = ({
    modalId = "editModal",
    headerText = "Edit Action Item",
    actionItemData = {},
    onSave = () => { },
}) => {
    const actionItemsRef = useRef(null);
    const statusRef = useRef(null);

    useEffect(() => {
        if (actionItemsRef.current) {
            actionItemsRef.current.value = actionItemData.actionItems || "";
        }
        if (statusRef.current) {
            statusRef.current.value = actionItemData.status || "";
        }
    }, [actionItemData]);

    const handleSave = () => {
        const updatedData = {
            ...actionItemData,
            actionItems: actionItemsRef.current.value,
            status: statusRef.current.value,
        };
        onSave(updatedData); 
    };


    return (
        <Fragment>
            <div
                className="modal fade"
                id={modalId}
                tabIndex="-1"
                aria-labelledby={`${modalId}Label`}
                aria-hidden="true"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`${modalId}Label`}>
                                {headerText}
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="actionItems" className="form-label">
                                        Action Item
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="actionItems"
                                        name="actionItems"
                                        ref={actionItemsRef}
                                        rows="3"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">
                                        Status
                                    </label>
                                    <select
                                        className="form-select"
                                        id="status"
                                        name="status"
                                        ref={statusRef}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-turtle-primary"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditModal;
