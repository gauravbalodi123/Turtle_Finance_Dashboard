// components/BaseEditModal.jsx
import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const BaseEditModal = ({ show, onHide, title, children, onSubmit, loading }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static" // static backdrop
            centered
            size="md"
            scrollable
            dialogClassName="" // keep custom classes for styling
            contentClassName=""
        >
            <form onSubmit={onSubmit}>
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onHide}
                    ></button>
                </div>

                <div className="modal-body" style={{ maxHeight: "70vh" }}>
                    {children}
                </div>

                <div className="modal-footer">
                    <Button
                        type="submit"
                        className="btn btn-turtle-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default BaseEditModal;
