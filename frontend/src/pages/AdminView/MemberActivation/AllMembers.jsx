import React, { useState, useEffect } from 'react'
import axios from "axios";
import styles from '../../../styles/AdminLayout/MemberActivation/AllMembers.module.css'
import Lottie from "lottie-react";
import parrot from '../../../assets/animation/parrot.json'
// import TableComponent from '../../../components/SmallerComponents/TableComponent';
import OnboardMembersModal from './OnboardMembersModal';
import ActivateMemberModal from '../../../components/SmallerComponents/ActivateMemberModal ';

const AllMembers = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [clients, setClients] = useState([]);
    const [bookingClients, setBookingClients] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [completedPayments, setCompletedPayments] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [advisorAssignments, setAdvisorAssignments] = useState({
        ca: [],
        financialPlanner: [],
        insuranceAdvisor: [],
        estatePlanner: [],
        creditCardAdvisor: [],
        bankingCompliance: [],
    });
    const [activating, setActivating] = useState(false);
    const [advisorsList, setAdvisorsList] = useState([]);



    useEffect(() => {
        const fetchCompletedPayments = async () => {
            try {
                const response = await axios.get(`${url}/client/payments/completed`);
                setCompletedPayments(response.data);
            } catch (error) {
                console.error("Error fetching completed payments:", error);
            }
        };

        fetchCompletedPayments();
    }, [url]);

    const handleAdvisorChange = (roleKey, advisorId) => {
        setAdvisorAssignments(prev => ({
            ...prev,
            [roleKey]: [advisorId], // Only one advisor per role for now
        }));
    };


    const handleActivate = async () => {
        try {
            setActivating(true);

            const assignedAdvisorIds = Object.values(advisorAssignments).flat().filter(Boolean);
            if (assignedAdvisorIds.length < 3) {
                alert("Please assign at least 3 advisors.");
                return;
            }

            const payload = {
                advisors: assignedAdvisorIds,
                subscriptionDate: startDate,
                subscriptionStatus: "Active"
            };

            await axios.patch(`${url}/admin/clients/${selectedClient._id}/editClients`, payload);

            alert("Client activated successfully!");
            window.location.reload(); // Optional: refresh list or re-fetch clients
        } catch (error) {
            console.error("Activation failed:", error);
            alert("Failed to activate client.");
        } finally {
            setActivating(false);
        }
    };


    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const response = await axios.get(`${url}/admin/advisors`);
                setAdvisorsList(response.data);
            } catch (error) {
                console.error("Error fetching advisors:", error);
            }
        };

        fetchAdvisors();
    }, [url]);




    // Fetch clients for the modal dropdown
    useEffect(() => {
        const fetchBookingClients = async () => {
            setIsLoading(true);
            try {
                // Fetch both sets of data
                const [bookingsRes, clientsRes] = await Promise.all([
                    axios.get(`${url}/admin/allbookings`),
                    axios.get(`${url}/admin/clients`)
                ]);

                const allBookings = bookingsRes.data;
                const allClients = clientsRes.data;

                // ✅ Step 1: Build a Set of existing client emails
                const clientEmailsSet = new Set(allClients.map(client => client.email));

                // ✅ Step 2: Filter bookings that are NOT already clients and have a valid email
                const newBookingClients = allBookings.filter(booking => {
                    const email = booking?.invitee?.email;
                    return email && !clientEmailsSet.has(email);
                });

                // ✅ Step 3: Keep only the latest created booking per email
                const latestBookingMap = new Map();

                newBookingClients.forEach(booking => {
                    const email = booking?.invitee?.email;
                    if (!email) return;

                    const currentBookingCreatedAt = new Date(booking?.createdAt || 0); // ← Use createdAt here
                    const existingBooking = latestBookingMap.get(email);
                    const existingCreatedAt = existingBooking ? new Date(existingBooking.createdAt || 0) : null;

                    if (!existingBooking || currentBookingCreatedAt > existingCreatedAt) {
                        latestBookingMap.set(email, booking);
                    }
                });

                // ✅ Step 4: Convert Map to Array
                const uniqueLatestBookings = Array.from(latestBookingMap.values());

                console.log("✅ Unique booking clients (latest only):", uniqueLatestBookings);
                setBookingClients(uniqueLatestBookings);
            } catch (err) {
                console.error("❌ Failed to fetch booking clients:", err);
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
            bookingId,
            name,
            email,
            phone,
            clientType,
            password,
        } = formData;

        let finalName = name;
        let finalEmail = email;
        let finalPhone = phone;
        let finalClientType = clientType;
        let finalPassword = password;

        try {
            if (fromBooking && bookingId) {
                // Fetch booking
                const { data: bookingData } = await axios.get(
                    `${url}/admin/bookings/${bookingId}/editBooking`
                );

                finalName = bookingData.invitee?.fullName || name;
                finalEmail = bookingData.invitee?.email || email;
                finalPhone = (() => {
                    const q = bookingData.invitee?.questionsAndAnswers?.find(q =>
                        q.question?.toLowerCase().includes("phone")
                    );
                    return q?.phoneNumber || phone;
                })();
            }

            // ✅ Single register call for both cases
            await axios.post(`${url}/auth/register`, {
                name: finalName,
                email: finalEmail,
                phone: finalPhone,
                clientType: finalClientType,
                password: finalPassword,
                role: "client",
            });

            // Optional: Delete the booking
            if (fromBooking && bookingId) {
                await axios.delete(`${url}/admin/bookings/${bookingId}`);
            }

            // ✅ Send onboarding email
            await axios.post(`${url}/admin/sendOnboardingEmail`, {
                fullName: finalName,
                email: finalEmail,
                password: finalPassword,
            });

            alert("Member onboarded and email sent successfully!");
        } catch (err) {
            console.error("Onboarding failed:", err);
            alert("Failed to onboard member and can't send email. Please try again.");
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
                            {completedPayments.map((payment, idx) => {
                                const client = payment.clientId;

                                if (!client) return null; // safeguard

                                return (
                                    <div key={idx} className="border-top py-3 d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="fw-semibold">{client.fullName}</div>
                                            <div className=" d-flex gap-4 ">
                                                <strong>{client.clientType || "Turtle Client"}</strong>
                                                <p>{client.companyName && `${client.companyName}`}</p>
                                            </div>
                                            <div className="text-muted small">{client.email} • {client.phone}</div>
                                        </div>

                                        <div className="text-end">
                                            <div className="text-muted small mb-2">Payment Complete</div>
                                            <button
                                                className="btn btn-sm btn-custom-turtle-background"
                                                data-bs-toggle="modal"
                                                data-bs-target="#activateMemberModal"
                                                onClick={() => setSelectedClient(client)}
                                            >
                                                Activate
                                            </button>

                                        </div>


                                    </div>
                                );
                            })}

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

            <ActivateMemberModal
                modalId="activateMemberModal"
                clientName={selectedClient?.fullName}
                membershipStartDate={startDate}
                onStartDateChange={setStartDate}
                advisorAssignments={advisorAssignments}
                onAdvisorChange={handleAdvisorChange}
                onActivate={handleActivate}
                loading={activating}
                advisorsList={advisorsList}
            />



        </div>
    )
}

export default AllMembers;
