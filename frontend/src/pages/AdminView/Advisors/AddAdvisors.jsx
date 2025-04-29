import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddAdvisors = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    // Refs
    const advisorFullNameRef = useRef();
    const salutationRef = useRef();
    const advisorDomainRef = useRef();
    const countryCodeRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const addressRef = useRef();
    const dobRef = useRef();
    const genderRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newAdvisor = {
            advisorFullName: getValueOrNull(advisorFullNameRef),
            salutation: getValueOrNull(salutationRef),
            advisorDomain: getValueOrNull(advisorDomainRef),
            countryCode: getValueOrNull(countryCodeRef),
            phone: getValueOrNull(phoneRef),
            email: getValueOrNull(emailRef),
            address: getValueOrNull(addressRef),
            dob: getValueOrNull(dobRef),
            gender: getValueOrNull(genderRef),
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
            <div className=" card p-4">
                <h2 className="mb-4">Add Advisor</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Full Name*</label>
                            <input type="text" ref={advisorFullNameRef} className="form-control" required />
                        </div>
                        <div className="col">
                            <label className="form-label">Salutation</label>
                            <input type="text" ref={salutationRef} className="form-control" />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Domain</label>
                            <input type="text" ref={advisorDomainRef} className="form-control" />
                        </div>
                        <div className="col">
                            <label className="form-label">Country Code</label>
                            <input type="text" ref={countryCodeRef} className="form-control" maxLength={4} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Phone*</label>
                            <input type="tel" ref={phoneRef} className="form-control" required />
                        </div>
                        <div className="col">
                            <label className="form-label">Email*</label>
                            <input type="email" ref={emailRef} className="form-control" required />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Address</label>
                            <input type="text" ref={addressRef} className="form-control" />
                        </div>
                        <div className="col">
                            <label className="form-label">DOB</label>
                            <input type="date" ref={dobRef} className="form-control" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select ref={genderRef} className="form-select">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
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
