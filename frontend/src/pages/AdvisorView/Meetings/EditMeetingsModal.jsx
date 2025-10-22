// src/pages/AdvisorView/Meetings/EditMeetings.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import BaseEditModal from "../../../components/SmallerComponents/BaseEditModal";

const EditMeetings = ({ meetingId, clients, onSuccess, show, onHide }) => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);

    const titleRef = useRef();
    const transcriptUrlRef = useRef();
    const videoUrlRef = useRef();
    const dateRef = useRef();
    const meetingNumberRef = useRef();
    const actionItemsRef = useRef();
    const detailedNotesRef = useRef();

    // Fetch meeting data when modal opens
    useEffect(() => {
        if (!show || !meetingId) return;

        const fetchData = async () => {
            try {
                setInitialData(null);
                setFormData(null);

                // 🔹 Advisor route instead of admin
                const res = await axios.get(`${url}/advisor/tasks/${meetingId}/editTasks`);
                const data = res.data;

                const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

                const formattedData = {
                    ...data,
                    date: formatDate(data.date),
                    dueDate: formatDate(data.dueDate),
                };

                setInitialData(formattedData);
                setFormData(formattedData);
            } catch (error) {
                console.error("Error loading meeting data:", error);
            }
        };

        fetchData();
    }, [show, meetingId]);

    // Set form values when data is loaded
    useEffect(() => {
        if (!initialData) return;

        titleRef.current.value = initialData.title || "";
        transcriptUrlRef.current.value = initialData.transcriptUrl || "";
        videoUrlRef.current.value = initialData.videoUrl || "";
        dateRef.current.value = initialData.date || "";
        meetingNumberRef.current.value = initialData.meetingNumber || "";
        detailedNotesRef.current.value = initialData.detailedNotes || "";
    }, [initialData]);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            client: formData.client || null,
            title: getValueOrNull(titleRef),
            date: getValueOrNull(dateRef),
            meetingNumber: getValueOrNull(meetingNumberRef),
            actionItems: getValueOrNull(actionItemsRef),
            detailedNotes: getValueOrNull(detailedNotesRef),
            transcriptUrl: getValueOrNull(transcriptUrlRef),
            videoUrl: getValueOrNull(videoUrlRef),
        };

        try {
            // 🔹 Advisor patch route
            await axios.patch(`${url}/advisor/tasks/${meetingId}`, updatedData);

            onSuccess?.({ ...updatedData, _id: meetingId });
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update meeting.");
        } finally {
            setLoading(false);
        }
    };

    const clientOptions = clients?.map((c) => ({
        value: c._id,
        label: `${c.fullName} (${c.email})`,
    })) || [];

    return (
        <BaseEditModal
            show={show}
            onHide={onHide}
            title="Edit Meeting"
            onSubmit={handleSubmit}
            loading={loading}
        >
            {formData ? (
                <>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Client</label>
                            <Select
                                options={clientOptions}
                                value={clientOptions.find((c) => c.value === formData.client)}
                                onChange={(opt) =>
                                    setFormData((prev) => ({ ...prev, client: opt?.value || "" }))
                                }
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Title</label>
                            <input ref={titleRef} className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label>Meeting Number</label>
                            <input ref={meetingNumberRef} className="form-control" />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label>Date</label>
                            <input ref={dateRef} type="date" className="form-control" />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Transcript URL</label>
                            <input ref={transcriptUrlRef} className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label>Video URL</label>
                            <input ref={videoUrlRef} className="form-control" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Detailed Notes</label>
                        <textarea ref={detailedNotesRef} className="form-control" rows="4" />
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </BaseEditModal>
    );
};

export default EditMeetings;
