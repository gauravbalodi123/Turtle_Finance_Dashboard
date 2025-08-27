import React from "react";

const ActivateMemberModal = ({
    modalId = "activateMemberModal",
    clientName = "Client Name",
    membershipStartDate,
    onStartDateChange,
    advisorAssignments = {},
    onAdvisorChange = () => { },
    onActivate,
    loading,
    advisorsList = [],
}) => {
    const advisorRoles = [
        "CA",
        "Financial Planner",
        "Insurance Advisor",
        "Estate Planner",
        "Credit Card Advisor",
        "Banking and Compliance",
    ];

    const totalAssigned = Object.values(advisorAssignments).reduce(
        (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
        0
    );

    return (
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
                    {/* Header */}
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title" id={`${modalId}Label`}>
                            Assign Advisors – {clientName}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <p className="text-muted mb-4">
                            Assign advisors and set membership details to complete the onboarding process.
                            At least 3 advisors must be assigned.
                        </p>

                        {/* Membership Details */}
                        <div className="mb-4 border rounded p-3 bg-light">
                            <h6 className="fw-bold mb-3">Membership Details</h6>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Membership Start Date</label>
                                    <input
                                        type="date"
                                        value={membershipStartDate}
                                        onChange={(e) => onStartDateChange(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Advisor Sections */}
                        <div className="row g-3">
                            {advisorRoles.map((role, index) => (
                                <div className="col-md-6" key={index}>
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0 fw-semibold">{role}</h6>
                                            <span className="badge bg-light text-dark border rounded-pill px-2">
                                                {advisorAssignments[role]?.length || 0} assigned
                                            </span>
                                        </div>
                                        <select
                                            className="form-select"
                                            onChange={(e) => onAdvisorChange(role, e.target.value)}
                                        >
                                            <option value="">Select {role}</option>
                                            {advisorsList.map(advisor => (
                                                <option key={advisor._id} value={advisor._id}>
                                                    {advisor.advisorFullName} ({advisor.email})
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Info */}
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <p className="mb-0 text-muted">
                                Total Advisors Assigned: {totalAssigned}
                            </p>
                            <p className="mb-0 text-danger fw-semibold small">
                                Minimum 3 advisors required
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            onClick={onActivate}
                            className="btn btn-turtle-primary"
                            disabled={loading}
                        >
                            {loading ? "Activating..." : "Activate Membership"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivateMemberModal;
