import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const RiskProfileModal = ({ profileId, show, onHide }) => {
    const url = import.meta.env.VITE_URL;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch one specific Risk Profile by its ID
    useEffect(() => {
        if (!profileId || !show) return;
        setLoading(true);

        axios
            .get(`${url}/admin/edit/${profileId}/riskProfile`, { withCredentials: true })
            .then((res) => setProfile(res.data))
            .catch((err) => console.error("Error loading risk profile:", err))
            .finally(() => setLoading(false));
    }, [profileId, show, url]);

    if (!show) return null;

    return (
        <Modal show={show} onHide={onHide} size="xl" centered scrollable>
            <Modal.Header closeButton className="bg-light border-0">
                <Modal.Title className="fw-bold">View Risk Profile Response</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-light">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : !profile ? (
                    <p>No risk profile data found.</p>
                ) : (
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        {/* --- Header Row: Submitted At + Result --- */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Submitted At</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={
                                            profile.submittedAt
                                                ? new Date(profile.submittedAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "N/A"
                                        }
                                        disabled
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Risk Profile</Form.Label>
                                    <Form.Control type="text" value={profile.result || "N/A"} disabled />
                                </Form.Group>
                            </div>
                        </div>

                        {/* --- Main Info Fields --- */}
                        <div className="row">
                            {[
                                ["Full Name", profile.fullName],
                                ["PAN Number", profile.panNumber],
                                ["Address Line 1", profile.addressLine1],
                                ["Address Line 2", profile.addressLine2],
                                ["Phone Number", profile.phoneNumber],
                                ["Email Address", profile.emailAddress],
                                ["Gender", profile.gender],
                                ["Marital Status", profile.maritalStatus],
                                [
                                    "Date of Birth",
                                    profile.dateOfBirth
                                        ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN")
                                        : "N/A",
                                ],
                                ["Source of Income", profile.sourceOfIncome],
                                ["Parents Source of Income", profile.parentsSourceOfIncome],
                                ["Current Monthly Income", profile.currentMonthlyIncome],
                                ["Current Monthly Expenses", profile.currentMonthlyExpenses],
                                ["Total Investment", profile.totalInvestment],
                                ["Total EMIs", profile.totalEmis],
                                ["Investment Horizon", profile.investmentHorizon],
                                ["Equity Market Knowledge", profile.equityMarketKnowledge],
                                ["Income Nature", profile.incomeNature],
                                ["Investment Objective", profile.investmentObjective],
                                ["Reaction To Decline", profile.reactionToDecline],
                            ].map(([label, value], idx) => (
                                <div key={idx} className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">{label}</Form.Label>
                                        <Form.Control type="text" value={value || "N/A"} disabled />
                                    </Form.Group>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="bg-light border-0">
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RiskProfileModal;
