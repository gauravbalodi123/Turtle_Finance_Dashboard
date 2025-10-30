import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseEditModal from "../../../components/SmallerComponents/BaseEditModal";
import Select from "react-select";

const EditBookingsModal = ({ show, onHide, id, url, onSuccess }) => {
  axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [advisorOptions, setAdvisorOptions] = useState([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState([]);

  // format Date -> "YYYY-MM-DDTHH:mm" using local timezone
  const toLocalInputFormat = (utcString) => {
    if (!utcString) return "";
    const d = new Date(utcString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };


  // convert "YYYY-MM-DDTHH:mm" (local) -> ISO UTC string for saving
  const toUTCISOString = (localString) => {
    if (!localString) return null;
    return new Date(localString).toISOString();
  };

  useEffect(() => {
    if (!show || !id) return;

    const fetchAll = async () => {
      try {
        setFormData(null);

        const [bookingRes, advisorsRes] = await Promise.all([
          axios.get(`${url}/admin/bookings/${id}/editBooking`),
          axios.get(`${url}/admin/advisors`)
        ]);

        const booking = bookingRes.data;
        const advisorsList = advisorsRes.data || [];

        const options = advisorsList.map((a) => ({
          value: a._id || a.id || String(a._id),
          label:
            a.advisorFullName ||
            a.name ||
            (a.firstName && a.lastName && `${a.firstName} ${a.lastName}`) ||
            a.email ||
            `Advisor ${a._id || a.id || ""}`,
        }));
        setAdvisorOptions(options);

        const selected = (booking.advisors || [])
          .map((a) => {
            if (!a) return null;
            const idVal = a._id || a.id || (typeof a === "string" ? a : "");
            const label =
              a.advisorFullName ||
              a.name ||
              a.email ||
              options.find((o) => o.value === idVal)?.label ||
              `Advisor ${idVal}`;
            return { value: idVal, label };
          })
          .filter(Boolean);
        setSelectedAdvisors(selected);

        const questions = booking.invitee?.questionsAndAnswers || [];
        const phoneQA =
          questions.find((q) => q.question === "Phone Number") || {};
        const queryQA =
          questions.find((q) =>
            q.question?.toLowerCase().includes("queries")
          ) || {};

        // ✅ Add utm_source here
        setFormData({
          name: booking.name || "",
          status: booking.status || "",
          simplifiedStatus: booking.simplifiedStatus || "",
          event_type: booking.event_type || "",
          is_completed: booking.is_completed || "",
          start_time: booking.start_time || null,
          end_time: booking.end_time || null,
          clientName: booking.invitee?.fullName || "",
          clientEmail: booking.invitee?.email || "",
          phoneNumber: phoneQA.phoneNumber || "",
          countryCode: phoneQA.countryCode || "",
          clientQuery: queryQA.answer || "",
          canceledBy: booking.cancellation?.canceled_by || "",
          cancelReason: booking.cancellation?.reason || "",
          joinUrl: booking.location?.join_url || "",
          locationStatus: booking.location?.status || "",
          locationType: booking.location?.type || "",
          eventGuests: booking.event_guests || [],
          calendarExternalId: booking.calendar_event?.external_id || "",
          calendarKind: booking.calendar_event?.kind || "",
          inviteesActive: booking.invitees_counter?.active || 0,
          inviteesLimit: booking.invitees_counter?.limit || 1,
          inviteesTotal: booking.invitees_counter?.total || 1,
          backfillStatus: booking.backfillStatus || "",
          errorMessage: booking.errorMessage || "",
          meetingNotesPlain: booking.meeting_notes_plain || "",
          meetingNotesHtml: booking.meeting_notes_html || "",

          // 🟢 New UTM Source
          utm_source: booking.tracking?.utm_source || "",
        });
      } catch (err) {
        console.error("Error loading booking or advisors", err);
      }
    };

    fetchAll();
  }, [show, id, url]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        advisors: selectedAdvisors.map((a) => a.value),
        start_time: formData.start_time
          ? toUTCISOString(formData.start_time)
          : null,
        end_time: formData.end_time ? toUTCISOString(formData.end_time) : null,
        event_guests:
          formData.eventGuests?.map((g) => ({ email: g.email })) || [],
        invitee: {
          fullName: formData.clientName || null,
          email: formData.clientEmail || null,
          questionsAndAnswers: [
            ...(formData.phoneNumber || formData.countryCode
              ? [
                {
                  question: "Phone Number",
                  answer: `${formData.countryCode || ""}${formData.phoneNumber || ""
                    }`,
                  phoneNumber: formData.phoneNumber || null,
                  countryCode: formData.countryCode || null,
                },
              ]
              : []),
            ...(formData.clientQuery
              ? [
                {
                  question: "Any queries or concerns?",
                  answer: formData.clientQuery,
                },
              ]
              : []),
          ],
        },
        cancellation: {
          canceled_by: formData.canceledBy || null,
          reason: formData.cancelReason || null,
        },
        location: {
          join_url: formData.joinUrl || null,
          status: formData.locationStatus || null,
          type: formData.locationType || null,
        },
        calendar_event: {
          external_id: formData.calendarExternalId || null,
          kind: formData.calendarKind || null,
        },
        invitees_counter: {
          active: Number(formData.inviteesActive) || 0,
          limit: Number(formData.inviteesLimit) || 1,
          total: Number(formData.inviteesTotal) || 1,
        },

        // ✅ Include UTM Source in tracking object
        tracking: {
          utm_source: formData.utm_source || null,
        },

        backfillStatus: formData.backfillStatus || null,
        errorMessage: formData.errorMessage || null,
        meeting_notes_plain: formData.meetingNotesPlain || null,
        meeting_notes_html: formData.meetingNotesHtml || null,
      };

      const res = await axios.patch(
        `${url}/admin/bookings/${id}/editBooking`,
        updatedData
      );
      onSuccess(res.data);
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseEditModal
      show={show}
      onHide={onHide}
      title="Edit Booking"
      onSubmit={handleSubmit}
      loading={loading}
    >
      {formData ? (
        <>
          <div className="row mb-3">
            <div className="col">
              <label>Event Name</label>
              <input
                className="form-control"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="col">
              <label>Status</label>
              <input
                className="form-control"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              />
            </div>
          </div>

          {/* 🟢 Add UTM Source Field */}
          <div className="mb-3">
            <label>UTM Source</label>
            <input
              className="form-control"
              placeholder="Enter UTM Source"
              value={formData.utm_source || ""}
              onChange={(e) => handleChange("utm_source", e.target.value)}
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label>Start Time (IST)</label>
              <input
                type="datetime-local"
                className="form-control"
                value={
                  formData.start_time
                    ? formData.start_time.endsWith("Z")
                      ? toLocalInputFormat(formData.start_time)
                      : formData.start_time
                    : ""
                }
                onChange={(e) => handleChange("start_time", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label>End Time (IST)</label>
              <input
                type="datetime-local"
                className="form-control"
                value={
                  formData.end_time
                    ? formData.end_time.endsWith("Z")
                      ? toLocalInputFormat(formData.end_time)
                      : formData.end_time
                    : ""
                }
                onChange={(e) => handleChange("end_time", e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label>Client Name</label>
              <input
                className="form-control"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
              />
            </div>
            <div className="col">
              <label>Client Email</label>
              <input
                className="form-control"
                value={formData.clientEmail}
                onChange={(e) => handleChange("clientEmail", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Advisors</label>
            <Select
              options={advisorOptions}
              value={selectedAdvisors}
              onChange={setSelectedAdvisors}
              isMulti
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => String(opt.value)}
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label>Phone Number</label>
              <div className="input-group">
                <span className="input-group-text" style={{ width: "60px" }}>
                  <input
                    className="form-control border-0 p-0"
                    placeholder="+91"
                    value={formData.countryCode || ""}
                    onChange={(e) =>
                      handleChange("countryCode", e.target.value)
                    }
                  />
                </span>
                <input
                  className="form-control"
                  placeholder="Phone Number"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    handleChange("phoneNumber", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <label>Client Query</label>
              <input
                className="form-control"
                value={formData.clientQuery || ""}
                onChange={(e) => handleChange("clientQuery", e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label>Status</label>
              <select
                className="form-select"
                value={formData.status || ""}
                onChange={(e) =>
                  handleChange("status", e.target.value || null)
                }
              >
                <option value="">Select Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="rescheduled_canceled">
                  Rescheduled & Canceled
                </option>
              </select>
            </div>

            <div className="col-md-4">
              <label>Simplified Status</label>
              <select
                className="form-select"
                value={formData.simplifiedStatus || ""}
                onChange={(e) =>
                  handleChange("simplifiedStatus", e.target.value || null)
                }
              >
                <option value="">Select Simplified Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="completed_rescheduled">
                  Completed (Rescheduled)
                </option>
                <option value="rescheduled_canceled">
                  Rescheduled & Canceled
                </option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>Is Completed</label>
              <select
                className="form-select"
                value={formData.is_completed || ""}
                onChange={(e) =>
                  handleChange("is_completed", e.target.value || null)
                }
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label>Cancellation Reason</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.cancelReason || ""}
              onChange={(e) => handleChange("cancelReason", e.target.value)}
            />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </BaseEditModal>
  );
};

export default EditBookingsModal;
