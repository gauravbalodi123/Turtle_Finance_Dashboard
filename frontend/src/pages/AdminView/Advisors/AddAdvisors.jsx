import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const AddAdvisors = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // State for react-select
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedEventNames, setSelectedEventNames] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);

    // Refs
    const fullNameRef = useRef();
    const salutationRef = useRef();
    const countryCodeRef = useRef();
    const countryCode2Ref = useRef();
    const phoneRef = useRef();
    const phone2Ref = useRef();
    const addressRef = useRef();
    const dobRef = useRef();
    const genderRef = useRef();
    const linkedinRef = useRef();
    const qualificationRef = useRef();
    const experienceRef = useRef();
    const credentialsRef = useRef();
    const bioRef = useRef();
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

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newAdvisor = {
            advisorFullName: getValueOrNull(fullNameRef),
            salutation: getValueOrNull(salutationRef),
            advisorDomain: selectedDomains.map(d => d.value),
            countryCode: getValueOrNull(countryCodeRef),
            countryCode2: getValueOrNull(countryCode2Ref),
            phone: getValueOrNull(phoneRef),
            phone2: getValueOrNull(phone2Ref),
            email: selectedEmails.map(e => e.value),
            address: getValueOrNull(addressRef),
            dob: getValueOrNull(dobRef),
            gender: getValueOrNull(genderRef),
            eventName: selectedEventNames.map(e => e.value),
            qualification: getValueOrNull(qualificationRef),
            experience: Number(getValueOrNull(experienceRef)) || null,
            credentials: getValueOrNull(credentialsRef),
            bio: getValueOrNull(bioRef),
            linkedinProfile: getValueOrNull(linkedinRef),
            status: getValueOrNull(statusRef),
        };

        try {
            await axios.post(`${url}/admin/addAdvisor`, newAdvisor);
            alert("Advisor added successfully!");
            navigate("/adminautharized/admin/advisors");
        } catch (error) {
            console.error("Error adding advisor:", error);
            alert("Failed to add advisor. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-4">
            <div className="card p-4">
                <h2 className="mb-4">Add Advisor</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Full Name*</label>
                            <input type="text" ref={fullNameRef} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Salutation</label>
                            <input type="text" ref={salutationRef} className="form-control" />
                        </div>
                    </div>

                    {/* Phone + Code */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Country Code</label>
                            <input type="text" ref={countryCodeRef} className="form-control" maxLength={4} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Phone*</label>
                            <input type="tel" ref={phoneRef} className="form-control" required />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Country Code 2</label>
                            <input type="text" ref={countryCode2Ref} className="form-control" maxLength={4} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Phone 2</label>
                            <input type="tel" ref={phone2Ref} className="form-control" />
                        </div>
                    </div>

                    {/* Domain + Email */}
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
                                options={[]}
                                classNamePrefix="form-select"
                                formatCreateLabel={(inputValue) => inputValue}
                                noOptionsMessage={() => null}
                            />
                        </div>
                    </div>

                    {/* Address + DOB */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Address</label>
                            <input type="text" ref={addressRef} className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Date of Birth</label>
                            <input type="date" ref={dobRef} className="form-control" />
                        </div>
                    </div>

                    {/* Gender + LinkedIn */}
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Gender</label>
                            <select ref={genderRef} className="form-select">
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col">
                            <label className="form-label">LinkedIn Profile</label>
                            <input type="url" ref={linkedinRef} className="form-control" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div className="col">
                            <label className="form-label">Status</label>
                            <select className="form-select" ref={statusRef} defaultValue="Active">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Events + Qualification + Experience */}
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
                            <input type="text" ref={qualificationRef} className="form-control" />
                        </div>
                        <div className="col">
                            <label className="form-label">Experience (years)</label>
                            <input type="number" ref={experienceRef} className="form-control" />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-3">
                        <label className="form-label">Bio</label>
                        <textarea ref={bioRef} className="form-control" rows={5}></textarea>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-turtle-primary" disabled={loading}>
                            {loading ? "Saving..." : "Add Advisor"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdvisors;
