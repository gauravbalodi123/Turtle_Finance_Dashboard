import React, { Fragment, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const EditAdvisors = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);

    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedEventNames, setSelectedEventNames] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);

    const fullNameRef = useRef();
    const salutationRef = useRef();
    // const advisorDomainRef = useRef();
    const countryCodeRef = useRef();
    const countryCode2Ref = useRef();
    const phoneRef = useRef();
    const phone2Ref = useRef();
    const emailRef = useRef();
    const addressRef = useRef();
    const dobRef = useRef();
    const genderRef = useRef();
    // const eventNameRef = useRef();
    const qualificationRef = useRef();
    const experienceRef = useRef();
    const credentialsRef = useRef();
    const bioRef = useRef();
    const linkedinRef = useRef();
    const statusRef = useRef();



    const advisorDomainOptions = [
        { value: "Financial Planner", label: "Financial Planner" },
        { value: "Insurance Advisor", label: "Insurance Advisor" },
        { value: "Tax Advisor", label: "Tax Advisor" },
        { value: "Legal Advisor", label: "Legal Advisor" },
        { value: "Banking and Compliance Advisor", label: "Banking and Compliance Advisor" },
        { value: "Credit Card Advisor", label: "Credit Card Advisor" },
        { value: "Others", label: "Others" }
    ];

    const eventNameOptions = [
        { value: "Karma Conversation", label: "Karma Conversation" },
        { value: "Kick-off Conversation", label: "Kick-off Conversation" },
        { value: "Financial Planning Conversation with RIA Krishna Rath", label: "Financial Planning Conversation with RIA Krishna Rath" },
        { value: "Financial Planning Conversation with RIA Robins Joseph", label: "Financial Planning Conversation with RIA Robins Joseph" },
        { value: "Financial Planning Conversation with RIA Kashish", label: "Financial Planning Conversation with RIA Kashish" },
        { value: "Financial Planning Conversation with Anuj Paul", label: "Financial Planning Conversation with Anuj Paul" },
        { value: "Insurance Advisory Conversation with Anuj Paul", label: "Insurance Advisory Conversation with Anuj Paul" },
        { value: "Insurance Advisory Conversation with Rishabh", label: "Insurance Advisory Conversation with Rishabh" },
        { value: "Insurance Advisory Conversation with Shabad", label: "Insurance Advisory Conversation with Shabad" },
        { value: "Tax Planning Conversation with CA Nikhil", label: "Tax Planning Conversation with CA Nikhil" },
        { value: "Tax Planning Conversation with CA Rahul Sharma", label: "Tax Planning Conversation with CA Rahul Sharma" },
        { value: "Tax Planning Conversation with CA Aman", label: "Tax Planning Conversation with CA Aman" },
        { value: "Tax Planning Conversation with CA Priyal", label: "Tax Planning Conversation with CA Priyal" },
        { value: "Tax Planning Conversation with CA Ankit", label: "Tax Planning Conversation with CA Ankit" },
        { value: "Tax Planning Conversation with CA Raunak", label: "Tax Planning Conversation with CA Raunak" },
        { value: "Tax Planning Conversation with CA Amarnath Ambati", label: "Tax Planning Conversation with CA Amarnath Ambati" },
        { value: "Tax Planning Conversation with CA Siddhant Agarwal", label: "Tax Planning Conversation with CA Siddhant Agarwal" },
        { value: "Tax Planning Conversation with CA Sanyam Goel", label: "Tax Planning Conversation with CA Sanyam Goel" },
        { value: "Will Drafting Conversation with Anunay", label: "Will Drafting Conversation with Anunay" },
        { value: "Will Drafting Conversation with Arpit", label: "Will Drafting Conversation with Arpit" },
        { value: "Will Drafting Conversation with Kunal", label: "Will Drafting Conversation with Kunal" },
        { value: "Preliminary conversation on EPF with Kunal", label: "Preliminary conversation on EPF with Kunal" },
        { value: "Estate Planning with Adv. Geetanjali", label: "Estate Planning with Adv. Geetanjali" },
        { value: "Banking & Compliance Conversation with Shruti", label: "Banking & Compliance Conversation with Shruti" },
        { value: "Financial Planning Conversation with Shruti", label: "Financial Planning Conversation with Shruti" },
        { value: "Credit Card Advisory Conversation with Nishadh", label: "Credit Card Advisory Conversation with Nishadh" },
        { value: "Credit Card Advisory Conversation with Rishabh", label: "Credit Card Advisory Conversation with Rishabh" },
        { value: "Check In with Turtle", label: "Check In with Turtle" },
        { value: "Bitcoin Discussion with Varun", label: "Bitcoin Discussion with Varun" },
        { value: "Tax Planning Conversation with CA Ajay Vaswani", label: "Tax Planning Conversation with CA Ajay Vaswani" },
        { value: "ITR Filing | Kick-off Conversation", label: "ITR Filing | Kick-off Conversation" },
        { value: "First Conversation with Turtle", label: "First Conversation with Turtle" },
        { value: "Insurance Advisory Conversation with Rohit", label: "Insurance Advisory Conversation with Rohit" },
        { value: "Credit Card Advisory Conversation with Prashant", label: "Credit Card Advisory Conversation with Prashant" },
    ];



    const fetchAdvisorData = async (signal) => {
        try {
            const response = await axios.get(`${url}/admin/advisors/${id}/editAdvisors`, { signal });
            const advisor = response.data;

            const formatDate = (isoDate) => {
                return isoDate ? new Date(isoDate).toISOString().split("T")[0] : "";
            };

            const mapToSelectOptions = (valuesArray, optionsArray) => {
                if (!Array.isArray(valuesArray)) return [];
                return valuesArray
                    .map(val => optionsArray.find(opt => opt.value === val))
                    .filter(Boolean); // only valid options
            };

            // ✅ Set selected options for react-select
            setSelectedDomains(mapToSelectOptions(advisor.advisorDomain, advisorDomainOptions));
            setSelectedEventNames(mapToSelectOptions(advisor.eventName, eventNameOptions));
            setSelectedEmails(
                Array.isArray(advisor.email)
                    ? advisor.email.map(e => ({ value: e, label: e }))
                    : advisor.email
                        ? [{ value: advisor.email, label: advisor.email }]
                        : []
            );


            // ✅ Set other fields
            setFormData({
                ...advisor,
                dob: formatDate(advisor.dob),
            });

        } catch (error) {
            console.error("Error fetching advisor data:", error);
        }
    };


    useEffect(() => {
        const controller = new AbortController();
        fetchAdvisorData(controller.signal);
        return () => controller.abort();
    }, [id]);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    const getSelectedDomainValues = () => selectedDomains.map(item => item.value);
    const getSelectedEventValues = () => selectedEventNames.map(item => item.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            advisorFullName: getValueOrNull(fullNameRef),
            salutation: getValueOrNull(salutationRef),
            advisorDomain: getSelectedDomainValues(),
            countryCode: getValueOrNull(countryCodeRef),
            countryCode2: getValueOrNull(countryCode2Ref),
            phone: getValueOrNull(phoneRef),
            phone2: getValueOrNull(phone2Ref),
            email: selectedEmails.map(item => item.value),
            address: getValueOrNull(addressRef),
            dob: getValueOrNull(dobRef),
            gender: getValueOrNull(genderRef),
            eventName: getSelectedEventValues(),
            qualification: getValueOrNull(qualificationRef),
            experience: getValueOrNull(experienceRef),
            credentials: getValueOrNull(credentialsRef),
            bio: getValueOrNull(bioRef),
            linkedinProfile: getValueOrNull(linkedinRef),
            status: getValueOrNull(statusRef),
        };

        try {
            await axios.patch(`${url}/admin/advisors/${id}/editAdvisors`, updatedData);
            alert("Advisor data updated successfully!");
            navigate("/adminautharized/admin/advisors");
        } catch (error) {
            console.log("Error updating advisor:", error);
            alert("Failed to update advisor. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <p>Loading...</p>;

    return (
        <Fragment>
            <div className="container my-4">
                <div className="card  p-4">
                    <h2 className="mb-4">Edit Advisor</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" ref={fullNameRef} defaultValue={formData.advisorFullName} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Salutation</label>
                                <input type="text" className="form-control" ref={salutationRef} defaultValue={formData.salutation} />
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
                                <label className="form-label">Phone2</label>
                                <input type="text" className="form-control" ref={phone2Ref} defaultValue={formData.phone2} />
                            </div>

                        </div>

                        <div className="row mb-3">

                            <div className="col-md-6">
                                <label className="form-label">Domain(s)</label>
                                <Select
                                    isMulti
                                    options={advisorDomainOptions}
                                    value={selectedDomains}
                                    onChange={setSelectedDomains}
                                    placeholder="Select domain(s)..."
                                    classNamePrefix="form-select"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email(s)</label>
                                <CreatableSelect
                                    isMulti
                                    isClearable
                                    placeholder="Add email(s)..."
                                    value={selectedEmails}
                                    onChange={setSelectedEmails}
                                    options={[]} // no options, just free text
                                    classNamePrefix="form-select"
                                    formatCreateLabel={(inputValue) => inputValue} // shows typed text as-is
                                    noOptionsMessage={() => null} // hide "no options" message
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" ref={addressRef} defaultValue={formData.address} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Date of Birth</label>
                                <input type="date" className="form-control" ref={dobRef} defaultValue={formData.dob} />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col">
                                <label className="form-label">Gender</label>
                                <select className="form-select" ref={genderRef} defaultValue={formData.gender || ""}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="col">
                                <label className="form-label">LinkedIn Profile</label>
                                <input type="url" className="form-control" ref={linkedinRef} defaultValue={formData.linkedinProfile} />
                            </div>

                            <div className="col">
                                <label className="form-label">Status</label>
                                <select className="form-select" ref={statusRef} defaultValue={formData.status || "Active"}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Event(s)</label>
                                <Select
                                    isMulti
                                    options={eventNameOptions}
                                    value={selectedEventNames}
                                    onChange={setSelectedEventNames}
                                    placeholder="Select event(s)..."
                                    classNamePrefix="form-select"
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">Qualification</label>
                                <input type="text" className="form-control" ref={qualificationRef} defaultValue={formData.qualification} />
                            </div>
                            <div className="col">
                                <label className="form-label">Experience (in years)</label>
                                <input type="number" className="form-control" ref={experienceRef} defaultValue={formData.experience} />
                            </div>
                        </div>

                        {/* <div className="row mb-3">
                            
                            <div className="col-md-6">
                                <label className="form-label">Credentials</label>
                                <input type="text" className="form-control" ref={credentialsRef} defaultValue={formData.credentials} />
                            </div>
                        </div> */}

                        <div className="row mb-3">
                            <div className="col-12">
                                <label className="form-label">Bio</label>
                                <textarea className="form-control" rows={10} ref={bioRef} defaultValue={formData.bio}></textarea>
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

export default EditAdvisors;
