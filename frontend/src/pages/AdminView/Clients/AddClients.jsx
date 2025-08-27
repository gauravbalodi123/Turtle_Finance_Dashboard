import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddClients = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    // Refs
    const fullNameRef = useRef();
    const salutationRef = useRef();
    const leadSourceIdRef = useRef();
    const leadSourceRef = useRef();
    const subscriptionStatusRef = useRef();
    const clientTypeRef = useRef();
    const genderRef = useRef();
    const countryCodeRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const addressRef = useRef();
    const subscriptionDateRef = useRef();
    const onboardingStatusRef = useRef();
    const riskProfileDateRef = useRef();
    const kickOffDateRef = useRef();
    const dobRef = useRef();
    const companyNameRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newClient = {
            fullName: getValueOrNull(fullNameRef),
            salutation: getValueOrNull(salutationRef),
            leadSourceId: getValueOrNull(leadSourceIdRef),
            leadSource: getValueOrNull(leadSourceRef),
            subscriptionStatus: getValueOrNull(subscriptionStatusRef),
            clientType: getValueOrNull(clientTypeRef),
            gender: getValueOrNull(genderRef),
            countryCode: getValueOrNull(countryCodeRef),
            phone: getValueOrNull(phoneRef),
            email: getValueOrNull(emailRef),
            address: getValueOrNull(addressRef),
            subscriptionDate: getValueOrNull(subscriptionDateRef),
            onboardingStatus: getValueOrNull(onboardingStatusRef),
            riskProfileDate: getValueOrNull(riskProfileDateRef),
            kickOffDate: getValueOrNull(kickOffDateRef),
            dob: getValueOrNull(dobRef),
            companyName: getValueOrNull(companyNameRef),
        };

        try {
            await axios.post(`${url}/admin/addClient`, newClient);
            alert("Client added successfully!");
            navigate("/adminautharized/admin/clients");
        } catch (error) {
            console.error("Error adding client:", error);
            alert("Failed to add client. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-4">
            <div className="card  p-4">
                <h2 className="mb-4">Add Client</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Full Name *</label>
                            <input type="text" className="form-control" ref={fullNameRef} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Salutation</label>
                            <input type="text" className="form-control" ref={salutationRef} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Lead Source ID</label>
                            <input type="text" className="form-control" ref={leadSourceIdRef} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Lead Source</label>
                            <input type="text" className="form-control" ref={leadSourceRef} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Subscription Status</label>
                            <select className="form-select" ref={subscriptionStatusRef}>
                                <option value="">Select status</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                                <option value="Up for Renewal">Up for Renewal</option>
                                <option value="Prospect">Prospect</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Gender</label>
                            <select className="form-select" ref={genderRef}>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Null">Null</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Country Code</label>
                            <input type="text" className="form-control" ref={countryCodeRef} maxLength="4" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Phone *</label>
                            <input type="text" className="form-control" ref={phoneRef} required />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Email *</label>
                            <input type="email" className="form-control" ref={emailRef} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Address</label>
                            <input type="text" className="form-control" ref={addressRef} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Subscription Date</label>
                            <input type="date" className="form-control" ref={subscriptionDateRef} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Onboarding Status</label>
                            <select className="form-select" ref={onboardingStatusRef}>
                                <option value="">Select status</option>
                                <option value="Not Started">Not Started</option>
                                <option value="RIA Allocated">RIA Allocated</option>
                                <option value="Payment Received">Payment Received</option>
                                <option value="Risk Profile Done">Risk Profile Done</option>
                                <option value="Kick Off Done">Kick Off Done</option>
                                <option value="Contract Signed">Contract Signed</option>
                                <option value="null">null</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Risk Profile Date</label>
                            <input type="date" className="form-control" ref={riskProfileDateRef} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Kick Off Date</label>
                            <input type="date" className="form-control" ref={kickOffDateRef} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12 col-md-4">
                            <label className="form-label">Date of Birth</label>
                            <input type="date" className="form-control" ref={dobRef} />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Company Name</label>
                            <input type="text" className="form-control" ref={companyNameRef} />
                        </div>
                        <div className="col-12 col-md-4">
                                <label className="form-label">Case Type</label>
                                <select className="form-select" ref={clientTypeRef} >
                                    <option value="">Select</option>
                                    <option value="NRI">NRI</option>
                                    <option value="Indian">Indian</option>

                                </select>
                            </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-turtle-primary" disabled={loading}>
                            {loading ? "Saving..." : "Add Client"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClients;
