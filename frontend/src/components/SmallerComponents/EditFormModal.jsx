import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const EditFormModal = ({ id, url, clients, advisors, onSuccess }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Refs
    const titleRef = useRef();
    const dateRef = useRef();
    const actionItemsRef = useRef();
    const responsiblePersonRef = useRef();
    const statusRef = useRef();
    const dueDateRef = useRef();

    useEffect(() => {
        if (formData) {
            titleRef.current.value = formData.title || "";
            dateRef.current.value = formData.date || "";
            actionItemsRef.current.value = formData.actionItems || "";
            responsiblePersonRef.current.value = formData.responsiblePerson || "";
            statusRef.current.value = formData.status || "Pending";
            dueDateRef.current.value = formData.dueDate || "";
        }
    }, [formData]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await axios.get(`${url}/admin/rowwisetasks/${id}/editRowWiseTasks`);
                const task = res.data;
                const formatDate = (isoDate) =>
                    isoDate ? new Date(isoDate).toISOString().split("T")[0] : "";

                setFormData({
                    ...task,
                    date: formatDate(task.date),
                    dueDate: formatDate(task.dueDate),
                });

            } catch (error) {
                console.error("Error loading task", error);
            }
        };

        fetchData();
    }, [id]);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const updatedData = {
            client: formData.client,
            advisor: formData.advisor,
            title: getValueOrNull(titleRef),
            date: getValueOrNull(dateRef),
            actionItems: getValueOrNull(actionItemsRef),
            responsiblePerson: getValueOrNull(responsiblePersonRef),
            status: getValueOrNull(statusRef),
            dueDate: getValueOrNull(dueDateRef),
        };

        try {
            await axios.patch(`${url}/admin/rowwisetasks/${id}/editRowWiseTasks`, updatedData);
            onSuccess();  

        } catch (error) {
            console.log("Error updating task:", error);
            alert("Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    const clientOptions = clients.map(c => ({ value: c._id, label: `${c.fullName} (${c.email})` }));
    const advisorOptions = advisors.map(a => ({ value: a._id, label: `${a.advisorFullName} (${a.email})` }));

    return (
        <div className="modal fade" id="editFormModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    {formData ? (
                        <form onSubmit={handleSubmit}> {/* Form to edit task */}
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Task</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeEditFormModalBtn"></button>
                            </div>
                            <div className="modal-body">
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
                                        <label>Date</label>
                                        <input ref={dateRef} type="date" className="form-control" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label>Responsible Person</label>
                                        <input ref={responsiblePersonRef} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Due Date</label>
                                        <input ref={dueDateRef} type="date" className="form-control" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label>Action Items</label>
                                    <textarea ref={actionItemsRef} className="form-control" rows="3" />
                                </div>

                                <div className="mb-3">
                                    <label>Status</label>
                                    <select ref={statusRef} className="form-select">
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-turtle-primary"  data-bs-dismiss="modal" disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Loading state: show loading message or spinner
                        <div>
                            <div className="modal-header">
                                <h5 className="modal-title">Loading Task...</h5>
                            </div>
                            <div className="modal-body">
                                <p>Loading...</p> {/* You can add a spinner here */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default EditFormModal;
