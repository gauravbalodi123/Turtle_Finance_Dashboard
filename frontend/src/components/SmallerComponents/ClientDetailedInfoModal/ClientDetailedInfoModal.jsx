import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import ClientMeetingTab from "./ClientMeetingTab";
import EditMeetingModal from "../../../pages/AdminView/Meetings/EditMeetingsModal";
import { Modal } from "react-bootstrap";

const ClientDetailedInfoModal = ({ modalId = "clientDetailModal", clientId }) => {
    const url = import.meta.env.VITE_URL;
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Modal toggling
    const [showMainModal, setShowMainModal] = useState(false);
    const [showEditMeetingModal, setShowEditMeetingModal] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);

    // Dropdown data for edit modal
    const [clients, setClients] = useState([]);
    const [advisors, setAdvisors] = useState([]);

    // Fetch client details
    useEffect(() => {
        if (!clientId) return;
        setLoading(true);

        axios
            .get(`${url}/admin/clients/${clientId}/editClients`, { withCredentials: true })
            .then((res) => {
                setClientData(res.data);
                setLoading(false);
                setShowMainModal(true); // Open modal after fetch
            })
            .catch((err) => {
                console.error("Error fetching client details:", err);
                setLoading(false);
            });
    }, [clientId]);

    // Fetch clients & advisors for dropdowns
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

    // Toggle functions
    const handleEditMeeting = (meetingId) => {
        setSelectedMeetingId(meetingId);
        setShowMainModal(false);
        setShowEditMeetingModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditMeetingModal(false);
        setShowMainModal(true);
    };

    // Meeting update after edit
    const handleMeetingUpdate = (updatedMeeting) => {
        const fullClient = clients.find(c => c._id === updatedMeeting.client);
        const fullAdvisor = advisors.find(a => a._id === updatedMeeting.advisor);

        const enrichedMeeting = {
            ...updatedMeeting,
            client: fullClient,
            advisor: fullAdvisor,
        };

        setClientData(prev => ({
            ...prev,
            meetings: prev.meetings?.map(m => m._id === updatedMeeting._id ? enrichedMeeting : m)
        }));
    };

    return (
        <Fragment>
            {/* Main Client Modal */}
            <Modal
                show={showMainModal}
                onHide={() => setShowMainModal(false)}
                size="xl"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <div>
                        <h5 className="modal-title fw-bold">
                            {loading ? "Loading..." : `${clientData?.fullName || "No Name"}`}{" "}
                            {clientData?.status && (
                                <span className={`badge ms-2 ${clientData.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                                    {clientData.status}
                                </span>
                            )}
                        </h5>
                        <p className="text-muted mb-0">{clientData?.email || "No Email"}</p>
                        {clientData?.linkedinProfile ? (
                            <a href={clientData.linkedinProfile} target="_blank" rel="noreferrer"
                                className="text-primary text-decoration-none d-block mt-1">
                                🔗 LinkedIn Profile
                            </a>
                        ) : (
                            <p className="text-danger mb-0 mt-1">LinkedIn profile not present</p>
                        )}
                    </div>
                </Modal.Header>

                <Modal.Body>
                    {/* Tabs */}
                    <ul className="nav nav-tabs mb-3" id="clientTabs" role="tablist">
                        {["Summary View", "Meeting Notes", "Pending Tasks", "General Info"].map(
                            (tab, idx) => (
                                <li className="nav-item" role="presentation" key={idx}>
                                    <button
                                        className={`nav-link ${idx === 0 ? "active" : ""}`}
                                        id={`tab-${idx}`}
                                        data-bs-toggle="tab"
                                        data-bs-target={`#content-${idx}`}
                                        type="button"
                                        role="tab"
                                        aria-controls={`content-${idx}`}
                                        aria-selected={idx === 0 ? "true" : "false"}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>

                    {/* Tab Content */}
                    <div className="tab-content" id="clientTabsContent">
                        {/* Summary View */}
                        <div className="tab-pane fade show active" id="content-0" role="tabpanel">
                            {loading ? <p>Loading client info...</p> : (
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
                                                <div className="fw-bold">{clientData?.subscriptionDue || "N/A"}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="border rounded p-3 h-100">
                                                <div className="text-muted">
                                                    👥 Advisors Assigned ({clientData?.advisors?.length || 0})
                                                </div>
                                                <div className="d-flex flex-wrap gap-1 mt-1">
                                                    {clientData?.advisors?.length
                                                        ? clientData.advisors.map((name, i) => (
                                                            <span key={i} className="badge bg-light text-dark border">
                                                                {name}
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
                                                <div className="fw-bold fs-5">{clientData?.lastCallDaysAgo || "N/A"}</div>
                                                <div className="text-muted">days ago</div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="border rounded p-3 h-100 text-center">
                                                <div className="text-muted">📋 Tasks</div>
                                                <div>Pending: <span className="fw-bold">{clientData?.pendingTasks || 0}</span></div>
                                                <div className="text-danger">Overdue: <span className="fw-bold">{clientData?.overdueTasks || 0}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Bookings */}
                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold mb-0">Recent Bookings</h6>
                                            <button className="btn btn-sm btn-outline-primary">View All</button>
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
                                                        <td colSpan="3" className="text-center text-muted">No bookings available</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Meeting Notes */}
                        <div className="tab-pane fade" id="content-1" role="tabpanel">
                            <ClientMeetingTab
                                clientId={clientId}
                                onEditMeeting={handleEditMeeting}
                            />
                        </div>

                        {/* Pending Tasks */}
                        <div className="tab-pane fade" id="content-2" role="tabpanel">
                            <p className="text-muted">Pending tasks will go here.</p>
                        </div>

                        {/* General Info */}
                        <div className="tab-pane fade" id="content-3" role="tabpanel">
                            <p className="text-muted">General Info will go here.</p>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowMainModal(false)}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Edit Meeting Modal */}
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
        </Fragment>
    );
};

export default ClientDetailedInfoModal;
