// src/components/SmallerComponents/TaskModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const TaskModal = ({ show, onHide, title, content }) => {
    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ whiteSpace: "pre-wrap" }}>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskModal;
