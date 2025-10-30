import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import ClientMeetingTab from "./ClientMeetingTab";
import ClientGeneralInfoTab from "./ClientGeneralInfoTab";
import EditMeetingModal from "../../../pages/AdminView/Meetings/EditMeetingsModal";
import RiskProfileModal from "../RiskProfileModal";
import RiskProfileEditModal from "../RiskProfileEditModal";
import DigioResponseModal from "../DigioResponseModal";
import KYCReplaceModal from "../KYCReplaceModal";
import { Modal } from "react-bootstrap";
import styles from "../../../styles/AdminLayout/Clients/ClientDetailedModal.module.css";

const ClientDetailedInfoModal = ({ modalId = "clientDetailModal", clientId, onClose }) => {
    const url = import.meta.env.VITE_URL;
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Summary View");

    const [showEditMeetingModal, setShowEditMeetingModal] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);

    // ✅ RiskProfile modals
    const [showRiskProfileModal, setShowRiskProfileModal] = useState(false);
    const [showRiskProfileEditModal, setShowRiskProfileEditModal] = useState(false);

    const [clients, setClients] = useState([]);
    const [advisors, setAdvisors] = useState([]);

    const [selectedRiskProfileId, setSelectedRiskProfileId] = useState(null);

    const [showDigioModal, setShowDigioModal] = useState(false);

    const [showKYCReplaceModal, setShowKYCReplaceModal] = useState(false);
    const [kycReplaceType, setKycReplaceType] = useState(null);



    const showMain =
        !!clientId &&
        !loading &&
        !showEditMeetingModal &&
        !showRiskProfileModal &&
        !showRiskProfileEditModal &&
        !showDigioModal &&
        !showKYCReplaceModal;

    // Fetch client details
    useEffect(() => {
        if (!clientId) return;
        setLoading(true);

        axios
            .get(`${url}/admin/clients/${clientId}/editClients`, { withCredentials: true })
            .then((res) => {
                setClientData(res.data);
            })
            .catch((err) => console.error("Error fetching client details:", err))
            .finally(() => setLoading(false));
    }, [clientId, url]);

    // Fetch clients & advisors
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [cRes, aRes] = await Promise.all([
                    axios.get(`${url}/admin/clients`),
                    axios.get(`${url}/admin/advisors`),
                ]);
                setClients(cRes.data);
                setAdvisors(aRes.data);
            } catch (err) {
                console.error("Failed to fetch dropdown data:", err);
            }
        };
        fetchDropdownData();
    }, [url]);

    const handleEditMeeting = (meetingId) => {
        setSelectedMeetingId(meetingId);
        setShowEditMeetingModal(true);
    };

    const handleCloseEditModal = () => setShowEditMeetingModal(false);

    const handleMeetingUpdate = (updatedMeeting) => {
        const fullClient = clients.find((c) => c._id === updatedMeeting.client);
        const fullAdvisor = advisors.find((a) => a._id === updatedMeeting.advisor);

        const enrichedMeeting = {
            ...updatedMeeting,
            client: fullClient,
            advisor: fullAdvisor,
        };

        setClientData((prev) => ({
            ...prev,
            meetings: prev.meetings?.map((m) =>
                m._id === updatedMeeting._id ? enrichedMeeting : m
            ),
        }));
    };

    const handleCloseMainModal = () => {
        setClientData(null);
        setSelectedMeetingId(null);
        setShowEditMeetingModal(false);
        if (typeof onClose === "function") onClose();
    };

    // --------------------------
    // Render Tabs
    // --------------------------
    const renderActiveTab = () => {
        switch (activeTab) {
            case "Summary View":
                return (
                    <>
                        <div className="mb-3">
                            <h6 className="fw-bold">Client Bio</h6>
                            <p>{clientData?.bio || "No bio available"}</p>
                        </div>

                        {/* Summary Cards */}
                        <div className="row g-3">
                            <div className="col-md-3">
                                <div className="border rounded p-3 h-100">
                                    <div className="text-muted">📅 Membership Expiry</div>
                                    <div className="fw-bold">
                                        {clientData?.subscriptionDue
                                            ? new Date(clientData.subscriptionDue).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="border rounded p-3 h-100">
                                    <div className="text-muted">
                                        👥 Advisors Assigned ({clientData?.advisors?.length || 0})
                                    </div>
                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                        {clientData?.advisors?.length
                                            ? clientData.advisors.map((a, i) => (
                                                <span
                                                    key={i}
                                                    className="badge bg-light text-dark border"
                                                >
                                                    {a.advisorFullName ||
                                                        a.email ||
                                                        "Unnamed Advisor"}
                                                </span>
                                            ))
                                            : "No advisors"}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="border rounded p-3 h-100 text-center">
                                    <div className="text-muted">📞 Calls</div>
                                    <div className="fw-bold fs-5">{clientData?.calls || 0}</div>
                                    <div className="text-success">completed</div>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="border rounded p-3 h-100 text-center">
                                    <div className="text-muted">⏰ Last Call</div>
                                    <div className="fw-bold fs-5">
                                        {clientData?.lastCallDaysAgo || "N/A"}
                                    </div>
                                    <div className="text-muted">days ago</div>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="border rounded p-3 h-100 text-center">
                                    <div className="text-muted">📋 Tasks</div>
                                    <div>
                                        Pending:{" "}
                                        <span className="fw-bold">
                                            {clientData?.pendingTasks || 0}
                                        </span>
                                    </div>
                                    <div className="text-danger">
                                        Overdue:{" "}
                                        <span className="fw-bold">
                                            {clientData?.overdueTasks || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-bold mb-0">Recent Bookings</h6>
                                <button className="btn btn-sm btn-outline-primary">
                                    View All
                                </button>
                            </div>
                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>Advisor</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientData?.recentBookings?.length ? (
                                        clientData.recentBookings.map((b, i) => (
                                            <tr key={i}>
                                                <td>{b.advisor}</td>
                                                <td>{b.date}</td>
                                                <td>{b.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center text-muted">
                                                No bookings available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                );

            case "Meeting Notes":
                return (
                    <ClientMeetingTab
                        clientId={clientId}
                        onEditMeeting={handleEditMeeting}
                    />
                );

            case "Pending Tasks":
                return <p className="text-muted">Pending tasks will go here.</p>;

            case "General Info":
                return (
                    <ClientGeneralInfoTab
                        clientId={clientId}
                        onOpenRiskProfileModal={() => setShowRiskProfileModal(true)}
                        onOpenRiskProfileEditModal={() => setShowRiskProfileEditModal(true)}
                        onOpenDigioModal={() => setShowDigioModal(true)}
                        setSelectedRiskProfileId={setSelectedRiskProfileId}
                        onOpenKYCReplaceModal={(type) => {
                            setKycReplaceType(type);
                            setShowKYCReplaceModal(true);
                        }}
                    />



                );

            default:
                return null;
        }
    };

    return (
        <Fragment>
            <Modal
                show={showMain}
                onHide={handleCloseMainModal}
                size="xl"
                centered
                backdrop="static"
                keyboard={false}
                scrollable
                contentClassName={styles.clientModalContent}
            >
                {/* ✅ Sticky Header with Tabs */}
                <Modal.Header closeButton className={`bg-white ${styles.modalHeader}`}>
                    <div className="w-100">
                        <div className="d-flex justify-content-between align-items-start flex-wrap">
                            <div>
                                <h5 className="modal-title fw-bold">
                                    {loading
                                        ? "Loading..."
                                        : `${clientData?.fullName || "No Name"}`}{" "}
                                    {clientData?.status && (
                                        <span
                                            className={`badge ms-2 ${clientData.status === "Active"
                                                ? "bg-success"
                                                : "bg-secondary"
                                                }`}
                                        >
                                            {clientData.status}
                                        </span>
                                    )}
                                </h5>
                                <p className="text-muted mb-0">
                                    {clientData?.email || "No Email"}
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <ul className={`nav nav-tabs mt-3 ${styles.tabs}`} role="tablist">
                            {["Summary View", "Meeting Notes", "Pending Tasks", "General Info"].map(
                                (tab, idx) => (
                                    <li className="nav-item" key={idx}>
                                        <button
                                            className={`nav-link ${activeTab === tab ? "active" : ""
                                                }`}
                                            onClick={() => setActiveTab(tab)}
                                            type="button"
                                        >
                                            {tab}
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </Modal.Header>

                {/* ✅ Scrollable body */}
                <Modal.Body className={styles.scrollBody}>
                    {loading ? <p>Loading...</p> : renderActiveTab()}
                </Modal.Body>
            </Modal>

            {/* Meeting Edit Modal */}
            <EditMeetingModal
                meetingId={selectedMeetingId}
                show={showEditMeetingModal}
                onHide={handleCloseEditModal}
                clients={clients}
                advisors={advisors}
                onSuccess={(updated) => {
                    handleMeetingUpdate(updated);
                    handleCloseEditModal();
                }}
            />

            {/*  Risk Profile Modal */}
            <RiskProfileModal
                clientId={clientId}
                profileId={selectedRiskProfileId}
                show={showRiskProfileModal}
                onHide={() => {
                    setShowRiskProfileModal(false);
                    setSelectedRiskProfileId(null);
                }}
            />

            {/*  Risk Profile Edit Modal */}
            <RiskProfileEditModal
                clientId={clientId}
                profileId={selectedRiskProfileId}
                show={showRiskProfileEditModal}
                onHide={() => {
                    setShowRiskProfileEditModal(false);
                    setSelectedRiskProfileId(null);
                }}
            />

            <DigioResponseModal
                clientId={clientId}
                show={showDigioModal}
                onHide={() => setShowDigioModal(false)}
            />

            <KYCReplaceModal
                show={showKYCReplaceModal}
                onHide={() => setShowKYCReplaceModal(false)}
                clientId={clientId}
                type={kycReplaceType}
                onSuccess={() => {
                    //  Close KYC modal
                    setShowKYCReplaceModal(false);
                    //  refresh data automatically when done
                    setTimeout(() => {
                        if (activeTab === "General Info") {
                            // Trigger a silent refresh
                            axios
                                .get(`${url}/admin/clients/${clientId}/general-info`, { withCredentials: true })
                                .then(() => console.log("KYC refreshed"));
                        }
                    }, 500);
                }}
            />






        </Fragment>
    );
};

export default ClientDetailedInfoModal;
