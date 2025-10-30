import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const KYCReplaceModal = ({ show, onHide, clientId, type, onSuccess }) => {
    const url = import.meta.env.VITE_URL;
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file");
        setLoading(true);

        const formData = new FormData();
        formData.append(type, file);

        try {
            const { data } = await axios.post(`${url}/admin/clients/${clientId}/${type}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            // Notify parent that upload was successful
            onSuccess?.({
                fileId: data.fileId,
                type,
                fileName: file.name,
                uploadedAt: new Date().toISOString(),
            });

            // ✅ Don’t call onHide() instantly — parent handles closing sequence
            setTimeout(() => onHide?.(), 300); // slight delay avoids flicker
        } catch (err) {
            console.error(`Error uploading ${type}:`, err);
            alert(`Failed to upload ${type.toUpperCase()}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Replace {(type || "").toUpperCase()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Select new {(type || "").toUpperCase()} file</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleUpload} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Upload"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default KYCReplaceModal;
