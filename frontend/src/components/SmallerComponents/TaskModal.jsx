import React, { Fragment } from "react";

const TaskModal = ({
    modalId = "taskModal",
    headerText = "Modal Title",
    bodyContent = "Modal Content",
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
                <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
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
                        <div className="modal-body pt-0" style={{ whiteSpace: "pre-wrap" }}>
                            {bodyContent}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-turtle-primary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TaskModal;
