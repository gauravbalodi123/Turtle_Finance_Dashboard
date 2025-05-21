import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import BaseAddModal from "../../../components/SmallerComponents/BaseAddModal";

const AddTaskModal = ({ clients, advisors, onSuccess }) => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [loading, setLoading] = useState(false);
    const [clientOptions, setClientOptions] = useState([]);
    const [advisorOptions, setAdvisorOptions] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    // Refs for form fields
    const titleRef = useRef();
    const dateRef = useRef();
    const actionItemsRef = useRef();
    const responsiblePersonRef = useRef();
    const statusRef = useRef();
    const dueDateRef = useRef();

    useEffect(() => {
        const clientMapped = clients.map(client => ({
            value: client._id,
            label: `${client.fullName} (${client.email})`
        }));
        const advisorMapped = advisors.map(advisor => ({
            value: advisor._id,
            label: `${advisor.advisorFullName} (${advisor.email})`
        }));
        setClientOptions(clientMapped);
        setAdvisorOptions(advisorMapped);
    }, [clients, advisors]);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    const resetForm = () => {
        // Clear refs
        titleRef.current.value = "";
        dateRef.current.value = "";
        actionItemsRef.current.value = "";
        responsiblePersonRef.current.value = "";
        statusRef.current.value = "Pending"; // or null if you want it blank
        dueDateRef.current.value = "";

        // Clear selects
        setSelectedClient(null);
        setSelectedAdvisor(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newData = {
            client: selectedClient?.value || null,
            advisor: selectedAdvisor?.value || null,
            title: getValueOrNull(titleRef),
            date: getValueOrNull(dateRef),
            actionItems: getValueOrNull(actionItemsRef),
            responsiblePerson: getValueOrNull(responsiblePersonRef),
            status: getValueOrNull(statusRef),
            dueDate: getValueOrNull(dueDateRef),
        };

        try {
            const res = await axios.post(`${url}/admin/rowwisetasks/addRowWiseTask`, newData);

            alert("Task added successfully!");
            onSuccess?.(res.data);
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
            modal.hide();
            resetForm();
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <BaseAddModal
            id="addTaskModal"
            title="Add Task"
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">Client</label>
                    <Select
                        options={clientOptions}
                        value={selectedClient}
                        onChange={setSelectedClient}
                        placeholder="Select a client"
                        isClearable
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Advisor</label>
                    <Select
                        options={advisorOptions}
                        value={selectedAdvisor}
                        onChange={setSelectedAdvisor}
                        placeholder="Select an advisor"
                        isClearable
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" ref={titleRef} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" ref={dateRef} required />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">Responsible Person</label>
                    <input type="text" className="form-control" ref={responsiblePersonRef} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Due Date</label>
                    <input type="date" className="form-control" ref={dueDateRef} />
                </div>
            </div>

            <div className="mb-3 col-md-12">
                <label className="form-label">Action Items</label>
                <textarea className="form-control" ref={actionItemsRef} rows="4"></textarea>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" ref={statusRef} defaultValue="Pending">
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>
        </BaseAddModal>
    );
};

export default AddTaskModal;
