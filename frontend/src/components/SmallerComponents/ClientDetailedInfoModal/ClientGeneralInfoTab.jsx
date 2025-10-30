import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";
import {
    FaRegEye,
    FaRegEdit,
    FaTrashAlt,
    FaDownload,
    FaPlus,
    FaUpload,
} from "react-icons/fa";

const ClientGeneralInfoTab = ({
    clientId,
    onOpenRiskProfileModal,
    onOpenRiskProfileEditModal,
    setSelectedRiskProfileId,
    onOpenDigioModal,
    onOpenKYCReplaceModal, // ✅ added from parent
}) => {
    const url = import.meta.env.VITE_URL;
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showOlderRisk, setShowOlderRisk] = useState(false);
    const [showOlderDigio, setShowOlderDigio] = useState(false);
    const [showOlderKyc, setShowOlderKyc] = useState(false);

    useEffect(() => {
        if (!clientId) return;
        setLoading(true);
        axios
            .get(`${url}/admin/clients/${clientId}/general-info`, { withCredentials: true })
            .then((res) => setInfo(res.data))
            .catch((err) => console.error("Error fetching general info:", err))
            .finally(() => setLoading(false));
    }, [clientId, url]);

    if (loading) return <p>Loading general info...</p>;
    if (!info) return <p>No general information available.</p>;

    const { client, riskProfiles, kyc, digio } = info;

    return (
        <div className="container-fluid px-0">
            {/* ---------- CONTACT & SUBSCRIPTION INFO ---------- */}
            <div className="card shadow-sm border-0 mb-4 rounded-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">General Information</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <h6 className="text-muted mb-2">Contact Information</h6>
                            <p className="mb-1">
                                <strong>Email:</strong> {client?.email?.[0] || "N/A"}
                            </p>
                            <p>
                                <strong>Phone:</strong> {client?.phone || "N/A"}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-muted mb-2">Subscription Details</h6>
                            <p className="mb-1">
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`badge rounded-pill bg-${client?.subscriptionStatus === "Active"
                                            ? "success"
                                            : "secondary"
                                        }`}
                                >
                                    {client?.subscriptionStatus}
                                </span>
                            </p>
                            <p>
                                <strong>Subscription Date:</strong>{" "}
                                {client?.subscriptionDate
                                    ? new Date(client.subscriptionDate).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- RISK PROFILE + DIGIO ---------- */}
            <div className="row g-3 mb-4">
                {/* Risk Profile */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">Risk Profile Responses</h6>
                                <button className="btn btn-sm btn-success rounded-pill px-3">
                                    <FaPlus className="me-1" /> Add
                                </button>
                            </div>

                            {riskProfiles?.latest ? (
                                <>
                                    <div className="border rounded-4 p-3 mb-2 bg-white">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-semibold small">
                                                    {new Date(
                                                        riskProfiles.latest.submittedAt
                                                    ).toLocaleDateString("en-IN")}
                                                </div>
                                                <span className="badge bg-teal text-white px-3 py-1">
                                                    {riskProfiles.latest.result || "N/A"}
                                                </span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-light border"
                                                    onClick={() => {
                                                        setSelectedRiskProfileId(riskProfiles.latest._id);
                                                        onOpenRiskProfileModal();
                                                    }}
                                                >
                                                    <FaRegEye />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light border"
                                                    onClick={() => {
                                                        setSelectedRiskProfileId(riskProfiles.latest._id);
                                                        onOpenRiskProfileEditModal();
                                                    }}
                                                >
                                                    <FaRegEdit />
                                                </button>
                                                <button className="btn btn-sm btn-light border text-danger">
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {riskProfiles.older?.length > 0 && (
                                        <div>
                                            <button
                                                className="btn btn-link p-0 mt-1"
                                                onClick={() => setShowOlderRisk((p) => !p)}
                                            >
                                                {showOlderRisk ? "Hide Older" : "View Older"}
                                            </button>

                                            {showOlderRisk && (
                                                <div className="mt-2">
                                                    {riskProfiles.older.map((rp, i) => (
                                                        <div
                                                            key={rp._id || i}
                                                            className="border rounded-4 p-3 mb-2 bg-light"
                                                        >
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <div className="fw-semibold small">
                                                                        {new Date(
                                                                            rp.submittedAt
                                                                        ).toLocaleDateString("en-IN")}
                                                                    </div>
                                                                    <span className="badge bg-secondary text-white px-3 py-1">
                                                                        {rp.result || "N/A"}
                                                                    </span>
                                                                </div>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-sm btn-light border"
                                                                        onClick={() => {
                                                                            setSelectedRiskProfileId(rp._id);
                                                                            onOpenRiskProfileModal();
                                                                        }}
                                                                    >
                                                                        <FaRegEye />
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-light border"
                                                                        onClick={() => {
                                                                            setSelectedRiskProfileId(rp._id);
                                                                            onOpenRiskProfileEditModal();
                                                                        }}
                                                                    >
                                                                        <FaRegEdit />
                                                                    </button>
                                                                    <button className="btn btn-sm btn-light border text-danger">
                                                                        <FaTrashAlt />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-muted small mb-0">No risk profile found</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Digio Advisory Agreement */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">Advisory Agreement</h6>
                                <button
                                    className="btn btn-sm btn-success rounded-pill px-3"
                                    onClick={onOpenDigioModal}
                                >
                                    <FaPlus className="me-1" /> Add
                                </button>
                            </div>

                            {digio?.latest ? (
                                <>
                                    <div className="border rounded-4 p-3 mb-2">
                                        <p className="fw-semibold mb-1">
                                            Investment Advisory Agreement{" "}
                                            {new Date(digio.latest.timestamps).getFullYear()}
                                        </p>
                                        <p className="small text-muted mb-1">
                                            Uploaded:{" "}
                                            {new Date(digio.latest.timestamps).toLocaleDateString("en-IN")}
                                        </p>
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                className="btn btn-sm btn-light border"
                                                onClick={onOpenDigioModal}
                                            >
                                                <FaRegEye />
                                            </button>
                                            <button className="btn btn-sm btn-light border text-danger">
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted small mb-0">
                                    No advisory agreements found
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- KYC DOCUMENTS ---------- */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">KYC Documents</h6>

                    <div className="row g-3">
                        {/* PAN Card */}
                        <div className="col-md-6">
                            <div className="border rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-semibold mb-0">PAN Card</h6>
                                    <button
                                        className="btn btn-sm btn-outline-secondary rounded-pill"
                                        onClick={() => onOpenKYCReplaceModal("pan")}
                                    >
                                        <FaUpload className="me-1" /> Replace
                                    </button>
                                </div>

                                {kyc?.latest?.panFileId ? (
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                className="rounded-circle border overflow-hidden"
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "#f8f9fa",
                                                }}
                                            >
                                                {kyc.latest.panFileId.filename?.toLowerCase().endsWith(".pdf") ? (
                                                    <FaFilePdf size={24} className="text-danger" />
                                                ) : (
                                                    <img
                                                        src={`${url}/admin/clients/pan/download/${clientId}`}
                                                        alt="PAN Preview"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="mb-1 small text-muted">
                                                    {kyc.latest.panFileId.filename || "pan-card.pdf"}
                                                </p>
                                                <span className="badge bg-light text-dark border">
                                                    {new Date(kyc.latest.panFileId.createdAt).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-light border"
                                                onClick={() =>
                                                    window.open(
                                                        `${url}/admin/clients/pan/download/${clientId}`,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                <FaDownload />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted small mb-0">No PAN uploaded</p>
                                )}
                            </div>
                        </div>

                        {/* Aadhaar Card */}
                        <div className="col-md-6">
                            <div className="border rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-semibold mb-0">Aadhaar Card</h6>
                                    <button
                                        className="btn btn-sm btn-outline-secondary rounded-pill"
                                        onClick={() => onOpenKYCReplaceModal("aadhaar")}
                                    >
                                        <FaUpload className="me-1" /> Replace
                                    </button>
                                </div>

                                {kyc?.latest?.aadhaarFileId ? (
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                className="rounded-circle border overflow-hidden"
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "#f8f9fa",
                                                }}
                                            >
                                                {kyc.latest.aadhaarFileId.filename?.toLowerCase().endsWith(".pdf") ? (
                                                    <FaFilePdf size={24} className="text-danger" />
                                                ) : (
                                                    <img
                                                        src={`${url}/admin/clients/aadhaar/download/${clientId}`}
                                                        alt="Aadhaar Preview"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="mb-1 small text-muted">
                                                    {kyc.latest.aadhaarFileId.filename || "aadhaar.pdf"}
                                                </p>
                                                <span className="badge bg-light text-dark border">
                                                    {new Date(kyc.latest.aadhaarFileId.createdAt).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-light border"
                                                onClick={() =>
                                                    window.open(
                                                        `${url}/admin/clients/aadhaar/download/${clientId}`,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                <FaDownload />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted small mb-0">No Aadhaar uploaded</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientGeneralInfoTab;
