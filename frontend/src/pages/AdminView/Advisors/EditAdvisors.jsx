import React, { Fragment, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditAdvisors = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);

    const fullNameRef = useRef();
    const salutationRef = useRef();
    const advisorDomainRef = useRef();
    const countryCodeRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const addressRef = useRef();
    const dobRef = useRef();
    const genderRef = useRef();

    const fetchAdvisorData = async (signal) => {
        try {
            const response = await axios.get(`${url}/admin/advisors/${id}/editAdvisors`, { signal });
            const data = response.data;

            const formatDate = (isoDate) => {
                if (!isoDate) return "";
                const date = new Date(isoDate);
                return date.toISOString().split("T")[0];
            };

            setFormData({
                ...data,
                dob: formatDate(data.dob),
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            advisorFullName: getValueOrNull(fullNameRef),
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
                                <label className="form-label">Domain</label>
                                <input type="text" className="form-control" ref={advisorDomainRef} defaultValue={formData.advisorDomain} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Country Code</label>
                                <input type="text" className="form-control" ref={countryCodeRef} defaultValue={formData.countryCode} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-control" ref={phoneRef} defaultValue={formData.phone} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" ref={emailRef} defaultValue={formData.email} required />
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
                            <div className="col-md-6">
                                <label className="form-label">Gender</label>
                                <select className="form-select" ref={genderRef} defaultValue={formData.gender || ""}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
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
