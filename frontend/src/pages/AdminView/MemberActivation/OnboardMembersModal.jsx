import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import BaseAddModal from "../../../components/SmallerComponents/BaseAddModal";
import { IoMdPersonAdd } from "react-icons/io";
import { BsCalendar2DateFill } from "react-icons/bs";

const OnboardMembersModal = ({ bookingClients, onSuccess, loading }) => {
    const [entryType, setEntryType] = useState("kc");
    const [selectedClient, setSelectedClient] = useState(null); // ✅ track selected client

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const caseTypeRef = useRef(null);
    const passwordRef = useRef(null);

    const clientOptions = bookingClients.map(b => {
        const name = b.invitee?.fullName || "Unnamed";
        const email = b.invitee?.email || "No Email";
        const phoneQuestion = b.invitee?.questionsAndAnswers?.find(q =>
            q.question?.toLowerCase().includes("phone")
        );
        const phone =
            phoneQuestion?.countryCode && phoneQuestion?.phoneNumber
                ? `${phoneQuestion.countryCode} ${phoneQuestion.phoneNumber}`
                : "No Phone";

        return {
            value: b._id,
            label: `${name} (${email}) : ${phone}`,
            fullName: name,
            email,
            phone,
            raw: b, // ✅ store full bookingClient if needed
        };
    });

    useEffect(() => {
        const modal = document.getElementById("onboardMemberModal");
        const handleShow = () => { };
        const handleHide = () => { };
        modal?.addEventListener("shown.bs.modal", handleShow);
        modal?.addEventListener("hidden.bs.modal", handleHide);
        return () => {
            modal?.removeEventListener("shown.bs.modal", handleShow);
            modal?.removeEventListener("hidden.bs.modal", handleHide);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        let data;

        if (entryType === "kc" && selectedClient) {
            // ✅ If user selected from KC
            data = {
                fromBooking: true,
                bookingId: selectedClient.value, // ✅ Booking document _id
                name: selectedClient.fullName,
                email: selectedClient.email,
                phone: selectedClient.phone,
                caseType: caseTypeRef.current?.querySelector("input:checked")?.value || "",
                password: passwordRef.current?.value || "",
            };
        } else {
            // ✅ Manual Entry
            data = {
                fromBooking: false,
                bookingId: null,
                name: nameRef.current?.value || "",
                email: emailRef.current?.value || "",
                phone: phoneRef.current?.value || "",
                caseType: caseTypeRef.current?.querySelector("input:checked")?.value || "",
                password: passwordRef.current?.value || "",
            };
        }

        onSuccess?.(data);

        const modal = bootstrap.Modal.getInstance(document.getElementById('onboardMemberModal'));
        modal.hide();
    };

    return (
        <BaseAddModal
            id="onboardMemberModal"
            title="Onboard New Member"
            onSubmit={handleSubmit}
            loading={loading}
        >
            <>
                <p>Choose how you want to onboard the new member.</p>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <button
                            className={`btn d-flex flex-column align-items-center w-100 ${entryType === "kc" ? "btn py-4 btn-turtle-primary" : "btn py-4 btn-outline-turtle-secondary"}`}
                            onClick={() => setEntryType("kc")}
                            type="button"
                        >
                            <IoMdPersonAdd className="mb-1 fs-4 d-block" />
                            From KC Booking
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button
                            className={`btn d-flex flex-column align-items-center w-100 ${entryType === "manual" ? "btn py-4 btn-turtle-primary" : "btn py-4 btn-outline-turtle-secondary"}`}
                            onClick={() => setEntryType("manual")}
                            type="button"
                        >
                            <BsCalendar2DateFill className="mb-1 fs-4 d-block" />
                            Manual Entry
                        </button>
                    </div>
                </div>

                {entryType === "kc" ? (
                    <div className="mb-3">
                        <label className="form-label">Search Booking Clients</label>
                        <Select
                            options={clientOptions}
                            value={selectedClient}
                            onChange={(opt) => setSelectedClient(opt)} // ✅ store selected
                            isClearable
                            placeholder="Search by name or email...."
                            formatOptionLabel={(option) => (
                                <div className="d-flex flex-column">
                                    <span className="fw-medium">{option.fullName}</span>
                                    <span className="text-muted small">{option.email}</span>
                                    <span className="text-muted small">{option.phone}</span>
                                </div>
                            )}
                            styles={{
                                option: (provided) => ({
                                    ...provided,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                }),
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="name" ref={nameRef} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" ref={emailRef} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input type="number" name="phone" ref={phoneRef} className="form-control" />
                        </div>
                    </>
                )}

                <hr />

                <div className="mb-3" ref={caseTypeRef}>
                    <label className="form-label d-block">Case Type</label>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="caseType" value="NRI" defaultChecked />
                        <label className="form-check-label">NRI</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="caseType" value="Resident Indian" />
                        <label className="form-check-label">Resident Indian</label>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" ref={passwordRef} className="form-control" placeholder="Enter password" />
                </div>
            </>
        </BaseAddModal>
    );
};

export default OnboardMembersModal;
