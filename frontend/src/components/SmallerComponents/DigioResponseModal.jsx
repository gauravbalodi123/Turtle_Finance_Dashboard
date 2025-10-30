// components/Admin/ClientModals/DigioResponseModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const DigioResponseModal = ({ clientId, show, onHide }) => {
    const url = import.meta.env.VITE_URL;
    const [digioDocId, setDigioDocId] = useState("");
    const [digioResponses, setDigioResponses] = useState([]);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch existing Digio responses
    useEffect(() => {
        if (!show || !clientId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${url}/admin/clients/${clientId}/digio-responses`, {
                    withCredentials: true,
                });
                setDigioResponses(res.data.data || []);
            } catch (err) {
                console.error("Error fetching Digio responses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [show, clientId, url]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!digioDocId.trim()) return setStatus({ type: "error", msg: "Document ID is required" });

        try {
            const res = await axios.post(
                `${url}/admin/clients/${clientId}/digio-response`,
                { digio_doc_id: digioDocId },
                { withCredentials: true }
            );
            setStatus({ type: "success", msg: res.data.msg });
            setDigioDocId("");

            // Refresh list
            const updated = await axios.get(`${url}/admin/clients/${clientId}/digio-responses`, {
                withCredentials: true,
            });
            setDigioResponses(updated.data.data || []);
        } catch (error) {
            setStatus({
                type: "error",
                msg: error.response?.data?.msg || "Failed to save Digio response.",
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this Digio response?")) return;
        try {
            await axios.delete(`${url}/admin/digio-response`, {
                params: { digio_doc_id: id },
                withCredentials: true,
            });
            setStatus({ type: "success", msg: "Response deleted successfully" });

            setDigioResponses((prev) => prev.filter((r) => r.digio_doc_id !== id));
        } catch (error) {
            setStatus({
                type: "error",
                msg: error.response?.data?.msg || "Failed to delete response",
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Advisory Agreement (Digio)</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Add New Response */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Digio Document ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={digioDocId}
                            onChange={(e) => setDigioDocId(e.target.value)}
                            placeholder="Enter Digio Document ID"
                        />
                    </div>
                    <Button type="submit" variant="success" className="w-100">
                        Add Digio Response
                    </Button>
                </form>

                {status && (
                    <p
                        className={`mt-3 small ${status.type === "success" ? "text-success" : "text-danger"
                            }`}
                    >
                        {status.msg}
                    </p>
                )}

                <hr />

                {/* Responses List */}
                <h6 className="fw-bold mb-3">Existing Digio Responses</h6>

                {loading ? (
                    <div className="text-center py-3">
                        <Spinner animation="border" />
                    </div>
                ) : digioResponses.length === 0 ? (
                    <p className="text-muted">No Digio responses found.</p>
                ) : (
                    <ul className="list-group">
                        {digioResponses.map((resp) => (
                            <li
                                key={resp._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <div>
                                        <strong>ID:</strong> {resp.digio_doc_id}
                                    </div>
                                    <small className="text-muted">
                                        {new Date(resp.timestamps).toLocaleString()}
                                    </small>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => {
                                            const width = 800,
                                                height = 600;
                                            const left = (window.innerWidth - width) / 2;
                                            const top = (window.innerHeight - height) / 2;
                                            window.open(
                                                `${url}/admin/digioDownload?digio_doc_id=${resp.digio_doc_id}`,
                                                "DigioPreview",
                                                `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                                            );
                                        }}
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDelete(resp.digio_doc_id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default DigioResponseModal;
