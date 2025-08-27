import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import BaseEditModal from "../../../components/SmallerComponents/BaseEditModal";

const EditBookingsModal = ({ id, url, onSuccess }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();
  const statusRef = useRef();
  const clientNameRef = useRef();
  const clientEmailRef = useRef();
  const canceledByRef = useRef();
  const cancelReasonRef = useRef();
  const joinUrlRef = useRef();
  const advisorEmailRef = useRef();
  const phoneNumberRef = useRef();
  const countryCodeRef = useRef();
  const clientQueryRef = useRef();


  const fetchData = async () => {
    try {
      setFormData(null);
      const res = await axios.get(`${url}/admin/bookings/${id}/editBooking`);
      const booking = res.data;
      const questions = booking.invitee?.questionsAndAnswers || [];
      const phoneQA = questions.find(q => q.question === "Phone Number") || {};
      const queryQA = questions.find(q => q.question?.toLowerCase().includes("queries")) || {};

      setFormData({
        ...booking,
        clientName: booking.invitee?.fullName || "",
        clientEmail: booking.invitee?.email || "",
        canceledBy: booking.cancellation?.canceled_by || "",
        cancelReason: booking.cancellation?.reason || "",
        joinUrl: booking.location?.join_url || "",
        advisorEmail: booking.event_guests?.[0]?.email || "",

        phoneNumber: phoneQA.phoneNumber || "",
        countryCode: phoneQA.countryCode || "",
        clientQuery: queryQA.answer || ""
      });
    } catch (error) {
      console.error("Error loading booking", error);
    }
  };

  useEffect(() => {
    const modal = document.getElementById("editBookingsModal");

    const handleModalOpen = () => {
      if (!id) return;
      fetchData();
    };

    modal?.addEventListener("shown.bs.modal", handleModalOpen);
    return () => modal?.removeEventListener("shown.bs.modal", handleModalOpen);
  }, [id]);

  const getValueOrNull = (ref) => {
    const value = ref.current?.value?.trim();
    return value === "" ? null : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const phoneNumber = getValueOrNull(phoneNumberRef);
    const countryCode = getValueOrNull(countryCodeRef);
    const clientQuery = getValueOrNull(clientQueryRef);

    const updatedData = {
      name: getValueOrNull(nameRef),
      status: getValueOrNull(statusRef),
      invitee: {
        fullName: getValueOrNull(clientNameRef),
        email: getValueOrNull(clientEmailRef),
        questionsAndAnswers: [
          ...(phoneNumber || countryCode ? [{
            question: "Phone Number",
            answer: `${countryCode || ''}${phoneNumber || ''}`,
            countryCode: countryCode || null,
            phoneNumber: phoneNumber || null
          }] : []),
          ...(clientQuery ? [{
            question: "Any queries or concerns?",
            answer: clientQuery
          }] : [])
        ]
      },
      cancellation: {
        canceled_by: getValueOrNull(canceledByRef),
        reason: getValueOrNull(cancelReasonRef),
      },
      location: {
        join_url: getValueOrNull(joinUrlRef),
      },
      event_guests: [{ email: getValueOrNull(advisorEmailRef) }],
    };

    try {
      await axios.patch(`${url}/admin/bookings/${id}/editBooking`, updatedData);
      onSuccess({ ...updatedData, _id: id });
      const modal = bootstrap.Modal.getInstance(document.getElementById('editBookingsModal'));
      modal.hide();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };


  return (
    <BaseEditModal
      id="editBookingsModal"
      title="Edit Booking"
      onSubmit={handleSubmit}
      loading={loading}
    >
      {formData ? (
        <>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label>Name</label>
              <input ref={nameRef} defaultValue={formData.name || ""} className="form-control" />
            </div>
            <div className="col-12 col-md-6">
              <label>Status</label>
              <input ref={statusRef} defaultValue={formData.status || ""} className="form-control" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label>Client Name</label>
              <input ref={clientNameRef} defaultValue={formData.clientName || ""} className="form-control" />
            </div>
            <div className="col-12 col-md-6">
              <label>Client Email</label>
              <input ref={clientEmailRef} defaultValue={formData.clientEmail || ""} className="form-control" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12">
              <label>Canceled By</label>
              <input ref={canceledByRef} defaultValue={formData.canceledBy || ""} className="form-control" />
            </div>

          </div>

          <div>
            <div className="col-12 mb-3">
              <label>Cancellation Reason</label>
              <textarea ref={cancelReasonRef} defaultValue={formData.cancelReason || ""} className="form-control" rows="3" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label>Join URL</label>
              <input ref={joinUrlRef} defaultValue={formData.joinUrl || ""} className="form-control" />
            </div>
            <div className="col-12 col-md-6">
              <label>Advisor Email</label>
              <input ref={advisorEmailRef} defaultValue={formData.advisorEmail || ""} className="form-control" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label>Phone Number</label>
              <div className="input-group">
                <span className="input-group-text px-auto" style={{ width: "50px" }}>
                  <input
                    ref={countryCodeRef}
                    defaultValue={formData.countryCode}
                    className="form-control border-0 p-0"
                    placeholder="+91"
                    style={{ width: "50px" }}
                  />
                </span>
                <input
                  ref={phoneNumberRef}
                  defaultValue={formData.phoneNumber}
                  className="form-control"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label>Client Query</label>
              <input
                ref={clientQueryRef}
                defaultValue={formData.clientQuery}
                className="form-control"
                placeholder="Any client questions"
              />
            </div>
          </div>


        </>
      ) : (
        <p>Loading...</p>
      )}
    </BaseEditModal>
  );
};

export default EditBookingsModal;
