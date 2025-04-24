import React, { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddTasks = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [advisors, setAdvisors] = useState([]);

    // Refs for form fields
    const clientRef = useRef();
    const advisorRef = useRef();
    const titleRef = useRef();
    // const participantsRef = useRef();
    const dateRef = useRef();
    const actionItemsRef = useRef();
    const responsiblePersonRef = useRef();
    const statusRef = useRef();
    const dueDateRef = useRef();

    useEffect(() => {
        const controller = new AbortController();

        const fetchDropdownData = async () => {
            try {
                const [clientRes, advisorRes] = await Promise.all([
                    axios.get(`${url}/admin/clients`, { signal: controller.signal }),
                    axios.get(`${url}/admin/advisors`, { signal: controller.signal }),
                ]);
                setClients(clientRes.data);
                setAdvisors(advisorRes.data);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };

        fetchDropdownData();

        return () => {
            controller.abort();
        };
    }, []);

    const getValueOrNull = (ref) => {
        const value = ref.current?.value?.trim();
        return value === "" ? null : value;
    };

    // const getArrayFromInput = (ref) => {
    //     const value = ref.current?.value?.trim();
    //     return value === "" ? [] : value.split(",").map((item) => item.trim());
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newData = {
            client: getValueOrNull(clientRef),
            advisor: getValueOrNull(advisorRef),
            title: getValueOrNull(titleRef),
            // participants: getArrayFromInput(participantsRef),
            date: getValueOrNull(dateRef),
            actionItems: getValueOrNull(actionItemsRef),
            responsiblePerson: getValueOrNull(responsiblePersonRef),
            status: getValueOrNull(statusRef),
            dueDate: getValueOrNull(dueDateRef),
        };

        try {
            await axios.post(`${url}/admin/rowwisetasks/addRowWiseTask`, newData);
            alert("Task added successfully!");
            navigate("/adminautharized/admin/rowwisetasks");
        } catch (error) {
            console.log("Error adding task:", error);
            alert("Failed to add task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <div className="container my-4">
                <div className="card shadow p-4">
                    <h2 className="mb-4">Add Task</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Client</label>
                                <select className="form-select" ref={clientRef} required>
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
                                <select className="form-select" ref={advisorRef}>
                                    <option value="">Select an advisor</option>
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

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-turtle-primary" disabled={loading}>
                                {loading ? "Saving..." : "Add Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default AddTasks;
