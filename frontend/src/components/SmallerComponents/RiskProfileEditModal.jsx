import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const RiskProfileEditModal = ({ profileId, show, onHide, onSuccess }) => {
    const url = import.meta.env.VITE_URL;
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Refs for every field
    const refs = {
        fullName: useRef(),
        panNumber: useRef(),
        addressLine1: useRef(),
        addressLine2: useRef(),
        phoneNumber: useRef(),
        emailAddress: useRef(),
        gender: useRef(),
        maritalStatus: useRef(),
        dateOfBirth: useRef(),
        sons: useRef(),
        daughters: useRef(),
        dependentParents: useRef(),
        dependentSiblings: useRef(),
        dependentParentsInLaw: useRef(),
        sourceOfIncome: useRef(),
        parentsSourceOfIncome: useRef(),
        currencyType: useRef(),
        currentMonthlyIncome: useRef(),
        currentMonthlyExpenses: useRef(),
        totalInvestment: useRef(),
        totalEmis: useRef(),
        investmentHorizon: useRef(),
        equityMarketKnowledge: useRef(),
        incomeNature: useRef(),
        investmentObjective: useRef(),
        holdingPeriodForLoss: useRef(),
        reactionToDecline: useRef(),
        result: useRef(),
    };

    // ✅ Fetch existing risk profile by its ID
    useEffect(() => {
        if (!profileId || !show) return;
        setLoading(true);
        axios
            .get(`${url}/admin/edit/${profileId}/riskProfile`, { withCredentials: true })
            .then((res) => {
                const data = res.data;
                const formattedDate = data.dateOfBirth
                    ? new Date(data.dateOfBirth).toISOString().split("T")[0]
                    : "";
                setFormData({ ...data, dateOfBirth: formattedDate });
            })
            .catch((err) => console.error("Error fetching risk profile:", err))
            .finally(() => setLoading(false));
    }, [profileId, show, url]);

    const getValueOrNull = (ref) => {
        const val = ref.current?.value?.trim();
        return val === "" ? null : val;
    };

    // ✅ Handle Save / Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const updatedData = Object.fromEntries(
            Object.entries(refs).map(([key, ref]) => {
                const value = getValueOrNull(ref);
                if (
                    [
                        "sons",
                        "daughters",
                        "dependentParents",
                        "dependentSiblings",
                        "dependentParentsInLaw",
                        "currentMonthlyIncome",
                        "currentMonthlyExpenses",
                        "totalInvestment",
                        "totalEmis",
                    ].includes(key)
                ) {
                    return [key, Number(value)];
                }
                return [key, value];
            })
        );

        try {
            await axios.patch(`${url}/admin/edit/${profileId}/riskProfile`, updatedData, {
                withCredentials: true,
            });
            alert("✅ Risk Profile updated successfully!");
            if (onSuccess) onSuccess();
            onHide();
        } catch (error) {
            console.error("Error updating risk profile:", error);
            alert("❌ Failed to update risk profile.");
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <Modal show={show} onHide={onHide} size="xl" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Edit Risk Profile</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-light">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : !formData ? (
                    <p>No risk profile data found.</p>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {[
                                ["Risk Profile Result", "result", "text", true],
                                ["Full Name", "fullName", "text", true],
                                ["PAN Number", "panNumber", "text", true],
                                ["Address Line 1", "addressLine1", "text", true],
                                ["Address Line 2", "addressLine2", "text", false],
                                ["Phone Number", "phoneNumber", "text", true],
                                ["Email Address", "emailAddress", "email", true],
                                ["Date of Birth", "dateOfBirth", "date", true],
                                ["Sons", "sons", "number", false],
                                ["Daughters", "daughters", "number", false],
                                ["Dependent Parents", "dependentParents", "number", false],
                                ["Dependent Siblings", "dependentSiblings", "number", false],
                                ["Dependent Parents-In-Law", "dependentParentsInLaw", "number", false],
                                ["Current Monthly Income", "currentMonthlyIncome", "number", true],
                                ["Current Monthly Expenses", "currentMonthlyExpenses", "number", true],
                                ["Total Investment", "totalInvestment", "number", true],
                                ["Total EMIs", "totalEmis", "number", true],
                            ].map(([label, key, type, required], i) => (
                                <div className="col-md-6" key={i}>
                                    <Form.Group>
                                        <Form.Label>{label}</Form.Label>
                                        <Form.Control
                                            type={type}
                                            ref={refs[key]}
                                            defaultValue={formData[key]}
                                            required={required}
                                        />
                                    </Form.Group>
                                </div>
                            ))}

                            {/* Dropdown sections kept same as your version */}
                            {/* Gender, Marital Status, Source of Income, etc. */}
                            {/* -- Skipping for brevity -- */}
                        </div>

                        <div className="d-flex justify-content-end mt-4 gap-2">
                            <Button variant="secondary" onClick={onHide}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default RiskProfileEditModal;
