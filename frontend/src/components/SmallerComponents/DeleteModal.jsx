import React, { Fragment } from 'react';

const DeleteModal = ({
    modalId = "deleteModal",
    headerText = "Modal Title",
    bodyContent = "Are you sure you want to proceed?",
    confirmButtonText = "Confirm",
    onConfirm = () => { }
}) => {
    return (
        <Fragment>
            <div
                className="modal fade"
                id={modalId}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby={`${modalId}Label`}
                aria-hidden="true"
            >
                <div className="modal-dialog">
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
                            {bodyContent}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-turtle-primary"
                                onClick={onConfirm}
                                data-bs-dismiss="modal"
                            >
                                {confirmButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default DeleteModal;
