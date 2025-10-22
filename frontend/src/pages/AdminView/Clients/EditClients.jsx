import React, { Fragment, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable"

const EditClients = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);

    // Refs for form fields
    const fullNameRef = useRef();
    const salutationRef = useRef();
    const leadSourceIdRef = useRef();
    const leadSourceRef = useRef();
    const subscriptionStatusRef = useRef();
    const clientTypeRef = useRef();
    const genderRef = useRef();
    const countryCodeRef = useRef();
    const phoneRef = useRef();
    const countryCode2Ref = useRef();
    const phone2Ref = useRef();
    const emailRef = useRef();
    const bioRef = useRef();
    const linkedinRef = useRef();
    const addressRef = useRef();
    const subscriptionDateRef = useRef();
    const subscriptionDueRef = useRef();
    const riskProfileDateRef = useRef();
    const kickOffDateRef = useRef();
    const onboardingStatusRef = useRef();
    const dobRef = useRef();
    const companyNameRef = useRef();

    const [emails, setEmails] = useState([]);

    const fetchClientData = async signal => {

        try {
            const response = await axios.get(`${url}/admin/clients/${id}/editClients`, { signal });
            const data = response.data;

            const formatDate = (isoDate) => {
                if (!isoDate) return "";
                const date = new Date(isoDate);
                return date.toISOString().split("T")[0];
            };

            setFormData({
                ...data,
                bio: data.bio || "",
                linkedinProfile: data.linkedinProfile || "",
                subscriptionDate: formatDate(data.subscriptionDate),
                subscriptionDue: formatDate(data.subscriptionDue),
                riskProfileDate: formatDate(data.riskProfileDate),
                kickOffDate: formatDate(data.kickOffDate),
                dob: formatDate(data.dob),
            });

            setEmails(
                Array.isArray(data.email)
                    ? data.email.map(e => ({ value: e, label: e }))
                    : data.email
                        ? [{ value: data.email, label: data.email }]
                        : []
            );
        } catch (error) {
            console.error("Error fetching client data:", error);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchClientData(controller.signal);

        return () => {
            controller.abort(); // Cancel API request if component unmounts or `id` changes
        };
    }, [id]);

    // helper function to convert "" to null in order to keep DB Consistent
    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            fullName: getValueOrNull(fullNameRef),
            salutation: getValueOrNull(salutationRef),
            leadSourceId: getValueOrNull(leadSourceIdRef),
            leadSource: getValueOrNull(leadSourceRef),
            subscriptionStatus: getValueOrNull(subscriptionStatusRef),
            clientType: getValueOrNull(clientTypeRef),
            gender: getValueOrNull(genderRef),
            countryCode: getValueOrNull(countryCodeRef),
            phone: getValueOrNull(phoneRef),
            countryCode2: getValueOrNull(countryCode2Ref),
            phone2: getValueOrNull(phone2Ref),
            email: emails.length ? emails.map(e => e.value) : null,
            address: getValueOrNull(addressRef),
            subscriptionDate: getValueOrNull(subscriptionDateRef),
            subscriptionDue: getValueOrNull(subscriptionDueRef),
            riskProfileDate: getValueOrNull(riskProfileDateRef),
            kickOffDate: getValueOrNull(kickOffDateRef),
            onboardingStatus: getValueOrNull(onboardingStatusRef),
            dob: getValueOrNull(dobRef),
            companyName: getValueOrNull(companyNameRef),
            bio: getValueOrNull(bioRef),                 // ✅ Added
            linkedinProfile: getValueOrNull(linkedinRef)
        };


        try {
            await axios.patch(`${url}/admin/clients/${id}/editClients`, updatedData);
            alert("Client data updated successfully!");
            navigate("/adminautharized/admin/clients");
        } catch (error) {
            console.log("Error updating client:", error);
            alert("Failed to update client. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <p>Loading...</p>;

    return (
        <Fragment>
            <div className="container my-4">
                <div className="card  p-4">
                    <h2 className="mb-4">Edit Client</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" ref={fullNameRef} defaultValue={formData.fullName} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Salutation</label>
                                <input type="text" className="form-control" ref={salutationRef} defaultValue={formData.salutation} />

                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Lead Source ID</label>
                                <input type="text" className="form-control" ref={leadSourceIdRef} defaultValue={formData.leadSourceId} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Lead Source</label>
                                <input type="text" className="form-control" ref={leadSourceRef} defaultValue={formData.leadSource} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Subscription Status</label>
                                <select className="form-select" ref={subscriptionStatusRef} defaultValue={formData.subscriptionStatus}>
                                    <option value="">Select</option>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Up for Renewal">Up for Renewal</option>
                                    <option value="Prospect">Prospect</option>
                                    <option value="Deadpool">Deadpool</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Gender</label>
                                <select className="form-select" ref={genderRef} defaultValue={formData.gender}>
                                    <option value="">Select</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Other</option>

                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Country Code</label>
                                <input type="text" className="form-control" ref={countryCodeRef} defaultValue={formData.countryCode} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-control" ref={phoneRef} defaultValue={formData.phone} required />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Country Code 2</label>
                                <input type="text" className="form-control" ref={countryCode2Ref} defaultValue={formData.countryCode2} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Phone 2</label>
                                <input type="text" className="form-control" ref={phone2Ref} defaultValue={formData.phone2} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Emails</label>
                                <CreatableSelect
                                    isMulti
                                    value={emails}
                                    onChange={setEmails}
                                    placeholder="Enter email(s)"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" ref={addressRef} defaultValue={formData.address} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Subscription Date</label>
                                <input type="date" className="form-control" ref={subscriptionDateRef} defaultValue={formData.subscriptionDate} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Subscription Due</label>
                                <input type="date" className="form-control" ref={subscriptionDueRef} defaultValue={formData.subscriptionDue} disabled />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Risk Profile Date</label>
                                <input type="date" className="form-control" ref={riskProfileDateRef} defaultValue={formData.riskProfileDate} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Kick Off Date</label>
                                <input type="date" className="form-control" ref={kickOffDateRef} defaultValue={formData.kickOffDate} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Company Name</label>
                                <input type="text" className="form-control" ref={companyNameRef} defaultValue={formData.companyName} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Onboarding Status</label>
                                <select className="form-select" ref={onboardingStatusRef} defaultValue={formData.onboardingStatus}>
                                    <option value="">Select</option>
                                    <option value="Not Started">Not Started</option>
                                    <option value="RIA Allocated">RIA Allocated</option>
                                    <option value="Payment Received">Payment Received</option>
                                    <option value="Risk Profile Done">Risk Profile Done</option>
                                    <option value="Kick Off Done">Kick Off Done</option>
                                    <option value="Contract Signed">Contract Signed</option>
                                </select>
                            </div>
                        </div>



                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Date of Birth</label>
                                <input type="date" className="form-control" ref={dobRef} defaultValue={formData.dob} />
                            </div>

                            <div className="col">
                                <label className="form-label">Client Type</label>
                                <select className="form-select" ref={clientTypeRef} defaultValue={formData.clientType}>
                                    <option value="">Select</option>
                                    <option value="NRI">NRI</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Indian Renewal">Indian Renewal</option>
                                    <option value="NRI Renewal">NRI Renewal</option>
                                </select>
                            </div>

                            <div className="col">
                                <label className="form-label">LinkedIn Profile</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    ref={linkedinRef}
                                    defaultValue={formData.linkedinProfile}
                                    placeholder="Enter LinkedIn URL"
                                />
                            </div>

                        </div>




                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Bio</label>
                                <textarea
                                    className="form-control"
                                    ref={bioRef}
                                    defaultValue={formData.bio}
                                    rows={6}
                                    placeholder="Enter bio"
                                />
                            </div>


                        </div>





                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-turtle-primary" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default EditClients;
