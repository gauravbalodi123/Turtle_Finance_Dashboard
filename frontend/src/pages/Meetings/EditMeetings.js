import React, { Fragment, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditMeetings = () => {
    const url = process.env.REACT_APP_HOSTED_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [clients, setClients] = useState([]);
    const [advisors, setAdvisors] = useState([]);

    // Refs for form fields
    const clientRef = useRef();
    const advisorRef = useRef();
    const titleRef = useRef();
    const transcriptUrlRef = useRef();
    const participantsRef = useRef();
    const videoUrlRef = useRef();
    const dateRef = useRef();
    const meetingNumberRef = useRef();
    const actionItemsRef = useRef();
    const detailedNotesRef = useRef();
    const summaryRef = useRef();
    const responsiblePersonRef = useRef();
    const statusRef = useRef();
    const dueDateRef = useRef();

    const fetchMeetingData = async (signal) => {
        try {
            const [taskRes, clientRes, advisorRes] = await Promise.all([
                axios.get(`${url}/tasks/${id}/editTasks`, { signal }),
                axios.get(`${url}/clients`, { signal }),
                axios.get(`${url}/advisors`, { signal }),
            ]);

            const taskData = taskRes.data;
            const clientsData = clientRes.data;
            const advisorsData = advisorRes.data;

            const formatDate = (isoDate) => {
                if (!isoDate) return "";
                const date = new Date(isoDate);
                return date.toISOString().split("T")[0];
            };

            setFormData({
                ...taskData,
                date: formatDate(taskData.date),
                dueDate: formatDate(taskData.dueDate),
            });

            setClients(clientsData);
            setAdvisors(advisorsData);
        } catch (error) {
            console.error("Error fetching task or clients data:", error);
        }
    };


    useEffect(() => {
        const controller = new AbortController();
        fetchMeetingData(controller.signal);

        return () => {
            controller.abort();
        };
    }, [id]);


    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    const getArrayFromInput = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? [] : value.split(",").map((item) => item.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            client: getValueOrNull(clientRef),
            advisor: getValueOrNull(advisorRef),
            title: getValueOrNull(titleRef),
            transcriptUrl: getValueOrNull(transcriptUrlRef),
            participants: getArrayFromInput(participantsRef),
            videoUrl: getValueOrNull(videoUrlRef),
            date: getValueOrNull(dateRef),
            meetingNumber: getValueOrNull(meetingNumberRef),
            actionItems: getValueOrNull(actionItemsRef),
            detailedNotes: getValueOrNull(detailedNotesRef),
            summary: getValueOrNull(summaryRef),
            responsiblePerson: getValueOrNull(responsiblePersonRef),
            status: getValueOrNull(statusRef),
            dueDate: getValueOrNull(dueDateRef),
        };

        try {
            await axios.patch(`${url}/tasks/${id}/editTasks`, updatedData);
            alert("Meeting data updated successfully!");
            navigate("/tasks");
        } catch (error) {
            console.log("Error updating meeting:", error);
            alert("Failed to update meeting. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <p>Loading...</p>;

    return (
        <Fragment>
            <div className="container my-4">
                <div className="card shadow p-4">
                    <h2 className="mb-4">Edit Meeting</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Client</label>
                                <select className="form-select" ref={clientRef} defaultValue={formData.client} required>
                                    <option value="">Select a client</option>
                                    {clients.map((client) => (
                                        <option key={client._id} value={client._id}>
                                            {client.fullName} ({client.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Advisor</label>
                                <select className="form-select" ref={advisorRef} defaultValue={formData.advisor}>
                                    <option value="">Select a advisor</option>
                                    {advisors.map((advisor) => (
                                        <option key={advisor._id} value={advisor._id}>
                                            {advisor.advisorFullName} ({advisor.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" ref={titleRef} defaultValue={formData.title || ""} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Meeting Number</label>
                                <input type="text" className="form-control" ref={meetingNumberRef} defaultValue={formData.meetingNumber || ""} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Date</label>
                                <input type="date" className="form-control" ref={dateRef} defaultValue={formData.date} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Responsible Person</label>
                                <input type="text" className="form-control" ref={responsiblePersonRef} defaultValue={formData.responsiblePerson || ""} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Transcript URL</label>
                                <input type="text" className="form-control" ref={transcriptUrlRef} defaultValue={formData.transcriptUrl || ""} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Video URL</label>
                                <input type="text" className="form-control" ref={videoUrlRef} defaultValue={formData.videoUrl || ""} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Participants (comma-separated emails)</label>
                            <input type="text" className="form-control" ref={participantsRef} defaultValue={formData.participants?.join(", ") || ""} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Action Items</label>
                            <textarea className="form-control" ref={actionItemsRef} rows="4" defaultValue={formData.actionItems || ""}></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Detailed Notes</label>
                            <textarea className="form-control" ref={detailedNotesRef} rows="5" defaultValue={formData.detailedNotes || ""}></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Summary</label>
                            <textarea className="form-control" ref={summaryRef} rows="5" defaultValue={formData.summary || ""}></textarea>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Status</label>
                                <select className="form-select" ref={statusRef} defaultValue={formData.status || "Pending"}>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default EditMeetings;
