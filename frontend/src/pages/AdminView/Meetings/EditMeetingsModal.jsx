import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import BaseEditModal from "../../../components/SmallerComponents/BaseEditModal";

const EditMeetingModal = ({ meetingId, clients, advisors, onSuccess }) => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);

    const titleRef = useRef();
    const transcriptUrlRef = useRef();
    // const participantsRef = useRef();
    const videoUrlRef = useRef();
    const dateRef = useRef();
    const meetingNumberRef = useRef();
    const actionItemsRef = useRef();
    const detailedNotesRef = useRef();
    // const summaryRef = useRef();
    // const responsiblePersonRef = useRef();
    // const statusRef = useRef();
    // const dueDateRef = useRef();

    useEffect(() => {
        if (!initialData) return;

        titleRef.current.value = initialData.title || "";
        transcriptUrlRef.current.value = initialData.transcriptUrl || "";
        // participantsRef.current.value = initialData.participants?.join(", ") || "";
        videoUrlRef.current.value = initialData.videoUrl || "";
        dateRef.current.value = initialData.date || "";
        meetingNumberRef.current.value = initialData.meetingNumber || "";
        // actionItemsRef.current.value = initialData.actionItems || "";
        detailedNotesRef.current.value = initialData.detailedNotes || "";
        // summaryRef.current.value = initialData.summary || "";
        // responsiblePersonRef.current.value = initialData.responsiblePerson || "";
        // statusRef.current.value = initialData.status || "Pending";
        // dueDateRef.current.value = initialData.dueDate || "";
    }, [initialData]);

    useEffect(() => {
        const modal = document.getElementById("editMeetingModal");

        const fetchData = async () => {
            try {

                setInitialData(null);
                setFormData(null);
                const res = await axios.get(`${url}/admin/tasks/${meetingId}/editTasks`);
                const data = res.data;

                const formatDate = (d) => d ? new Date(d).toISOString().split("T")[0] : "";



                setInitialData({
                    ...data,
                    date: formatDate(data.date),
                    dueDate: formatDate(data.dueDate),
                });

                setFormData({
                    ...data,
                    date: formatDate(data.date),
                    dueDate: formatDate(data.dueDate),
                });

            } catch (error) {
                console.error("Error loading meeting data:", error);
            }
        };

        const handleOpen = () => {
            if (meetingId) fetchData();
        };

        modal?.addEventListener("shown.bs.modal", handleOpen);
        return () => modal?.removeEventListener("shown.bs.modal", handleOpen);
    }, [meetingId]);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    // const getArrayFromInput = (ref) => {
    //     const value = ref.current?.value?.trim();
    //     return value === "" ? [] : value.split(",").map(item => item.trim());
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            client: formData.client || null,
            advisor: formData.advisor || null,
            title: getValueOrNull(titleRef),
            date: getValueOrNull(dateRef),
            meetingNumber: getValueOrNull(meetingNumberRef),
            actionItems: getValueOrNull(actionItemsRef),
            detailedNotes: getValueOrNull(detailedNotesRef),
            // summary: getValueOrNull(summaryRef),
            transcriptUrl: getValueOrNull(transcriptUrlRef), // ✅ add this
            videoUrl: getValueOrNull(videoUrlRef),
        };

        try {
            await axios.patch(`${url}/admin/tasks/${meetingId}/editTasks`, updatedData);

            // ✅ FIX: return updated data with _id so AllMeetings can update it
            onSuccess?.({ ...updatedData, _id: meetingId });
            const modal = bootstrap.Modal.getInstance(document.getElementById('editMeetingModal'));
            modal.hide();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update meeting.");
        } finally {
            setLoading(false);
        }
    };


    const clientOptions = clients.map(c => ({
        value: c._id,
        label: `${c.fullName} (${c.email})`
    }));

    const advisorOptions = advisors.map(a => ({
        value: a._id,
        label: `${a.advisorFullName} (${a.email})`
    }));

    return (
        <BaseEditModal
            id="editMeetingModal"
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
                                value={clientOptions.find(c => c.value === formData.client)}
                                onChange={(opt) => setFormData(prev => ({ ...prev, client: opt?.value || "" }))}
                                isClearable
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Advisor</label>
                            <Select
                                options={advisorOptions}
                                value={advisorOptions.find(a => a.value === formData.advisor)}
                                onChange={(opt) => setFormData(prev => ({ ...prev, advisor: opt?.value || "" }))}
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

                    {/* <div className="mb-3">
                        <label>Participants (comma-separated)</label>
                        <input ref={participantsRef} className="form-control" />
                    </div> */}

                    {/* <div className="mb-3">
                        <label>Action Items</label>
                        <textarea ref={actionItemsRef} className="form-control" rows="3" />
                    </div> */}

                    <div className="mb-3">
                        <label>Detailed Notes</label>
                        <textarea ref={detailedNotesRef} className="form-control" rows="4" />
                    </div>

                    {/* <div className="mb-3">
                        <label>Summary</label>
                        <textarea ref={summaryRef} className="form-control" rows="4" />
                    </div> */}


                </>
            ) : (
                <p>Loading...</p>
            )}
        </BaseEditModal>
    );
};

export default EditMeetingModal;
