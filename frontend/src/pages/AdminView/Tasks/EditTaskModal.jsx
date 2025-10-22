import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import BaseEditModal from "../../../components/SmallerComponents/BaseEditModal";

const EditTaskModal = ({ id, url, clients, advisors, onSuccess, show, onHide }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    const titleRef = useRef();
    const dateRef = useRef();
    const actionItemsRef = useRef();
    const responsiblePersonRef = useRef();
    const statusRef = useRef();
    const dueDateRef = useRef();

    // Fetch data when modal opens
    useEffect(() => {
        if (!show || !id) return;
        const fetchData = async () => {
            try {
                setFormData(null);
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
    }, [show, id, url]);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            client: formData.client || null,
            advisor: formData.advisor || null,
            title: getValueOrNull(titleRef),
            date: getValueOrNull(dateRef),
            actionItems: getValueOrNull(actionItemsRef),
            responsiblePerson: getValueOrNull(responsiblePersonRef),
            status: getValueOrNull(statusRef),
            dueDate: getValueOrNull(dueDateRef),
        };

        try {
            await axios.patch(`${url}/admin/rowwisetasks/${id}/editRowWiseTasks`, updatedData);
            onSuccess({ ...updatedData, _id: id });
           
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
        <BaseEditModal
            show={show}
            onHide={onHide}
            title="Edit Task"
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
                                onChange={(opt) =>
                                    setFormData((prev) => ({ ...prev, client: opt?.value || "" }))
                                }
                                isClearable
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Advisor</label>
                            <Select
                                options={advisorOptions}
                                value={advisorOptions.find(a => a.value === formData.advisor)}
                                onChange={(opt) =>
                                    setFormData((prev) => ({ ...prev, advisor: opt?.value || "" }))
                                }
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Title</label>
                            <input
                                ref={titleRef}
                                defaultValue={formData.title || ""}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Date</label>
                            <input
                                ref={dateRef}
                                type="date"
                                defaultValue={formData.date || ""}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Responsible Person</label>
                            <input
                                ref={responsiblePersonRef}
                                defaultValue={formData.responsiblePerson || ""}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Due Date</label>
                            <input
                                ref={dueDateRef}
                                type="date"
                                defaultValue={formData.dueDate || ""}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Action Items</label>
                        <textarea
                            ref={actionItemsRef}
                            className="form-control"
                            rows="3"
                            defaultValue={formData.actionItems || ""}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Status</label>
                        <select
                            ref={statusRef}
                            className="form-select"
                            defaultValue={formData.status || "Pending"}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </BaseEditModal>
    );
};

export default EditTaskModal;
