import React, { Fragment } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const ActionItemsModal = ({
    modalId = "actionItemsModal",
    headerText = "Action Items",
    actionItems = [],
    onEdit = () => { },
    onDelete = () => { },
    onStatusChange = () => { },
    statusClasses = {}
}) => {
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
                <div className="modal-dialog modal-dialog-scrollable modal-md modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-bottom-0">
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
                        <div className="modal-body pt-0 ">
                            {actionItems.length > 0 ? (
                                <ul className="list-group">
                                    {actionItems.map((item) => (
                                        <li
                                            key={item._id}
                                            className="list-group-item border border-0 d-flex justify-content-between align-items-center"
                                        >
                                            <div className="row align-items-center w-100">
                                                <div className="col-6">
                                                    {item.actionItems}
                                                </div>
                                                <div className="col-4">
                                                    <select
                                                        className={`form-select form-select-sm ${item.status === "Completed"
                                                            ? statusClasses.completed
                                                            : item.status === "Pending"
                                                                ? statusClasses.pending
                                                                : item.status === "Overdue"
                                                                    ? statusClasses.overdue
                                                                    : ""
                                                            }`}
                                                        value={item.status || ""}
                                                        onChange={(e) =>
                                                            onStatusChange(item._id, e.target.value)
                                                        }
                                                    >

                                                        <option value="Completed">Completed</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Overdue">Overdue</option>
                                                    </select>
                                                </div>

                                                <div className="col-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn p-2 btn-outline-turtle-secondary"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editModal"
                                                            onClick={() => onEdit(item._id)}
                                                        >
                                                            <FaRegEdit className="d-block fs-6" />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="btn p-2 btn-outline-turtle-secondary"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteModal" // 👈 open the delete modal automatically
                                                            onClick={() => onDelete(item._id)} // only setTargetId + setDeleteType
                                                        >
                                                            <RiDeleteBin6Line className="d-block fs-6" />
                                                        </button>


                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No Action Items Found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ActionItemsModal;
