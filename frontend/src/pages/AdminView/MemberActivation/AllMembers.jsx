import React, { useState, useEffect } from 'react'
import axios from "axios";
import styles from '../../../styles/AdminLayout/MemberActivation/AllMembers.module.css'
import Lottie from "lottie-react";
import parrot from '../../../assets/animation/parrot.json'
import TableComponent from '../../../components/SmallerComponents/TableComponent';
import OnboardMembersModal from './OnboardMembersModal';

const AllMembers = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [bookingClients, setBookingClients] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    // Fetch clients for the modal dropdown
    useEffect(() => {
        const fetchBookingClients = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${url}/admin/allbookings`);
                setBookingClients(res.data);
            } catch (err) {
                console.error("Failed to fetch booking clients:", err);
                setError("Failed to load booking clients data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingClients();
    }, [url]);

    const handleOnboardSubmit = async (formData) => {
        setModalLoading(true);
        setError(null);

        const {
            fromBooking,
            bookingId, // ✅ renamed from client
            name,
            email,
            phone,
            caseType,
            password,
        } = formData;

        try {
            if (fromBooking && bookingId) {
                // CASE: KC Booking

                // 1. Get the booking data first
                const { data: bookingData } = await axios.get(`${url}/admin/bookings/${bookingId}/editBooking`);

                // 2. Prepare payload for client creation
                const newClientData = {
                    fullName: bookingData.invitee?.fullName || name,
                    email: bookingData.invitee?.email || email,
                    phone: (() => {
                        const q = bookingData.invitee?.questionsAndAnswers?.find(q =>
                            q.question?.toLowerCase().includes("phone")
                        );
                        return q?.phoneNumber || phone;
                    })(),

                    caseType,
                    password,
                };

                // 3. Create the client
                await axios.post(`${url}/admin/addClient`, newClientData);

                // 4. Delete the booking
                await axios.delete(`${url}/admin/bookings/${bookingId}`);

                // 5. Placeholder: Send onboarding email (future step)

            } else {
                // CASE: Manual Entry
                const newClientData = {
                    fullName: name,
                    email,
                    phone,
                    caseType,
                    password,
                };

                await axios.post(`${url}/admin/addClient`, newClientData);
            }

            alert("Member onboarded successfully!");
        } catch (err) {
            console.error("Onboarding failed:", err);
            alert("Failed to onboard member. Please try again.");
        } finally {
            setModalLoading(false);
        }
    };



    return (
        <div className='container-fluid'>

            <div className='d-flex align-items-center justify-content-between mb-4 '>
                <div>
                    <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>Member Activation</h4>
                    <p className={`  ${styles.taskHeaderItem}`}>Manage the onboarding process for new members.</p>
                </div>

                <div>
                    {/* Bootstrap data attributes to open modal */}
                    <button
                        className="btn btn-custom-turtle-background"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#onboardMemberModal"
                    >
                        Onboard New Member
                    </button>
                </div>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="row gx-4 gy-4">
                    {/* Pending Activations */}
                    <div className="col-12 col-lg-6">
                        <div className="border rounded p-4 h-100 bg-white shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1">Pending Activations</h5>
                                    <p className="mb-0 text-muted">Members who have completed payment</p>
                                </div>
                                <span className="badge bg-warning text-light rounded-pill px-3 py-1">3 Pending</span>
                            </div>

                            {/* Member Cards */}
                            {[
                                { name: "Thomas Anderson", company: "Matrix Technologies", email: "thomas.anderson@example.com", phone: "(555) 123-4567", status: "Payment Complete" },
                                { name: "Rachel Green", company: "Central Perk Inc.", email: "rachel.green@example.com", phone: "(555) 234-5678", status: "Onboarding Ongoing" },
                                { name: "Walter White", company: "White Enterprises", email: "walter.white@example.com", phone: "(555) 345-6789", status: "Payment Complete" },
                            ].map((member, idx) => (
                                <div key={idx} className="border-top py-3 d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-semibold">{member.name}</div>
                                        <div className="text-muted">{member.company}</div>
                                        <div className="text-muted small">{member.email} • {member.phone}</div>
                                    </div>
                                    <div className="text-end">
                                        <div className="text-muted small mb-2">{member.status}</div>
                                        <button className="btn btn-sm btn-custom-turtle-background">Activate</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Renewal Upcoming */}
                    <div className="col-12 col-lg-6">
                        <div className="border rounded p-4 h-100 bg-white shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1">Renewal Upcoming</h5>
                                    <p className="mb-0 text-muted">Memberships expiring in next 2 months</p>
                                </div>
                                <span className="badge bg-info text-white rounded-pill px-3 py-1">3 Expiring</span>
                            </div>

                            {/* Member Cards */}
                            {[
                                { name: "John Smith", type: "Premium Member", email: "john.smith@example.com", phone: "(555) 111-2222", expiry: "Jun 15, 2025" },
                                { name: "Sarah Johnson", type: "Standard Member", email: "sarah.johnson@example.com", phone: "(555) 333-4444", expiry: "Jul 10, 2025" },
                                { name: "Mike Davis", type: "Premium Member", email: "mike.davis@example.com", phone: "(555) 555-6666", expiry: "Jul 25, 2025" },
                            ].map((member, idx) => (
                                <div key={idx} className="border-top py-3 d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-semibold">{member.name}</div>
                                        <div className="text-muted">{member.type}</div>
                                        <div className="text-muted small">{member.email} • {member.phone}</div>
                                    </div>
                                    <div className="text-end d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar3 text-muted"></i>
                                        <span className="text-muted small">Expires: {member.expiry}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            )}

            {/* Modal: Wrap your OnboardMembersModal inside Bootstrap modal markup */}
            <OnboardMembersModal
                bookingClients={bookingClients}
                loading={modalLoading}
                onSuccess={handleOnboardSubmit}
            />

        </div>
    )
}

export default AllMembers;
