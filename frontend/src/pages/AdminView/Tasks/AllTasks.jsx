import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parrot from '../../../assets/animation/parrot.json';
import TableComponent from '../../../components/SmallerComponents/TableComponent';
import styles from '../../../styles/AdminLayout/RowWiseTasks/AllRowWiseTasks.module.css';
import SearchFilter from '../../../components/SmallerComponents/SearchFilter';
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineErrorOutline } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa";
import { LuNotebook } from "react-icons/lu";
import DeleteModal from "../../../components/SmallerComponents/DeleteModal";
import ShowrowwisetaskModal from "../../../components/SmallerComponents/ShowrowwisetaskModal";
// import EditFormModal from "../../../components/SmallerComponents/EditFormModal";
import EditTaskModal from "./EditTaskModal";
import AddTaskModal from "./AddTaskModal";
import Select from "react-select";




const AllTasks = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const [rowWiseTasks, setRowWiseTasks] = useState([]);
    const [filteredRowWiseTasks, setFilteredRowWiseTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [targetId, setTargetId] = useState(null);
    const [taskStats, setTaskStats] = useState();

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedAdvisor, setSelectedAdvisor] = useState('');
    const [clientsList, setClientsList] = useState([]);
    const [advisorsList, setAdvisorsList] = useState([]);
    const [currentItem, setCurrentItem] = useState({});

    const [clients, setClients] = useState([]);
    const [advisors, setAdvisors] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const [sorting, setSorting] = useState([]);


    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const res = await axios.get(`${url}/admin/allAdvisorsClientsRowWiseTasks`);
                const { advisors, clients } = res.data;

                console.log("ADVISORS", advisors); // ✅ add this
                console.log("CLIENTS", clients);   // ✅ and this

                setAdvisors(advisors);
                setClients(clients);

                const advisorNames = advisors.map(a => a.advisorFullName).filter(Boolean);
                const clientNames = clients.map(c => c.fullName).filter(Boolean);

                setAdvisorsList(advisorNames);
                setClientsList(clientNames);

            } catch (err) {
                console.error("Failed to fetch dropdown advisor/client lists", err);
            }
        };

        fetchDropdownData();
    }, []);




    const openEditModal = (taskId) => {
        setSelectedTaskId(taskId);
    };

    const handleTaskUpdate = (updatedTask) => {
        const fullClient = clients.find(c => c._id === updatedTask.client) || null;
        const fullAdvisor = advisors.find(a => a._id === updatedTask.advisor) || null;

        const enrichedTask = {
            ...updatedTask,
            client: fullClient,
            advisor: fullAdvisor,
        };

        setRowWiseTasks(prev =>
            prev.map(task => task._id === updatedTask._id ? enrichedTask : task)
        );

        // setFilteredRowWiseTasks(prev =>
        //     prev.map(task => task._id === updatedTask._id ? enrichedTask : task)
        // );
    };



    const handleAddTaskSuccess = (newTask) => {
        // Update both task states
        setRowWiseTasks(prev => [newTask, ...prev]);
        // setFilteredRowWiseTasks(prev => [newTask, ...prev]);

    };






    useEffect(() => {
        console.log("[DEBUG] Running tooltip initialization...");

        const initializeTooltips = () => {
            // First destroy existing tooltips using Bootstrap's dispose method
            const tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipElements.forEach(el => {
                try {
                    const existingTooltip = bootstrap.Tooltip.getInstance(el);
                    if (existingTooltip) {
                        existingTooltip.dispose();
                    }
                } catch (err) {
                    console.error("[DEBUG] Tooltip dispose error:", err);
                }
            });

            console.log("[DEBUG] Reinitializing tooltips...");
            tooltipElements.forEach(tooltipTriggerEl => {
                try {
                    const tooltipInstance = new bootstrap.Tooltip(tooltipTriggerEl);
                    console.log("[DEBUG] Tooltip initialized:", tooltipInstance);
                } catch (err) {
                    console.error("[DEBUG] Tooltip initialization error:", err);
                }
            });

            console.log("[DEBUG] Tooltip initialization complete.");
        };

        // Call it immediately whenever filteredRowWiseTasks changes
        initializeTooltips();

        // Attach listeners to ALL modals dynamically
        const allModals = Array.from(document.querySelectorAll('.modal'));
        const handleModalShow = (event) => {
            console.log(`[DEBUG] Modal (${event.target.id}) opened, re-initializing tooltips...`);
            initializeTooltips();
        };

        allModals.forEach(modal => {
            modal.addEventListener('shown.bs.modal', handleModalShow);
        });

        // Cleanup event listeners
        return () => {
            allModals.forEach(modal => {
                modal.removeEventListener('shown.bs.modal', handleModalShow);
            });
        };

    }, [rowWiseTasks]);





    useEffect(() => {
        fetchTasks(pageIndex, pageSize, sorting, columnFilter, selectedAdvisor, selectedClient);
        fetchTaskStats();
    }, [pageIndex, pageSize, sorting, columnFilter, selectedAdvisor, selectedClient]);

    const fetchTasks = async (
        page = 0,
        size = 10,
        sorting = [],
        search = "",
        advisorFilter = "",
        clientFilter = ""
    ) => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/admin/selectiveRowwiseTasks`, {
                params: {
                    page: page + 1,
                    limit: size,
                    sortField,
                    sortOrder,
                    search,
                    advisor: advisorFilter,
                    client: clientFilter,
                },
            });

            setRowWiseTasks(res.data.tasks);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error("Failed to fetch rowwise tasks", err);
            setError("Failed to fetch rowwise tasks");
        } finally {
            setIsLoading(false);
        }
    };


    const fetchTaskStats = async () => {
        try {
            const res = await axios.get(`${url}/admin/rowwiseTasks/stats`);
            setTaskStats(res.data); // expects { completed, pending, overdue }
        } catch (err) {
            console.error("Failed to fetch task stats:", err);
        }
    };
    useEffect(() => {
        fetchTaskStats();
    }, []);





    // useEffect(() => {
    //     let filtered = rowWiseTasks;

    //     if (selectedClient) {
    //         filtered = filtered.filter(task => task.client?.fullName === selectedClient);
    //     }

    //     if (selectedAdvisor) {
    //         filtered = filtered.filter(task => task.advisor?.advisorFullName === selectedAdvisor);
    //     }

    //     // Also apply column search if user typed something
    //     if (columnFilter) {
    //         const lowerCaseFilter = columnFilter.toLowerCase();
    //         filtered = filtered.filter((task) =>
    //             Object.values(task).some(
    //                 (value) =>
    //                     value &&
    //                     value.toString().toLowerCase().includes(lowerCaseFilter)
    //             )
    //         );
    //     }

    //     setFilteredRowWiseTasks(filtered);
    // }, [selectedClient, selectedAdvisor, columnFilter, rowWiseTasks]);





    const handleDelete = async () => {
        if (!targetId) return;

        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/admin/rowwisetasks/${targetId}`);
            setRowWiseTasks((currTasks) =>
                currTasks.filter((task) => task._id !== targetId)
            );
        } catch (e) {
            console.log(e);
            alert("Error deleting the row-wise task");
        } finally {
            setLoadingId(null);
            setTargetId(null); // Clear targetId after deletion
        }
    };


    // useEffect(() => {
    //     if (!columnFilter) {
    //         setFilteredRowWiseTasks(rowWiseTasks);
    //         return;
    //     }

    //     const lowerCaseFilter = columnFilter.toLowerCase();

    //     const filteredData = rowWiseTasks.filter((task) =>
    //         Object.values(task).some(
    //             (value) =>
    //                 value &&
    //                 value.toString().toLowerCase().includes(lowerCaseFilter)
    //         )
    //     );

    //     setFilteredRowWiseTasks(filteredData);
    // }, [columnFilter, rowWiseTasks]);

    const columns = [
        // {
        //     accessorKey: "title",
        //     header: "Title",
        //     enableResizing: true,
        //     size: 260,
        //     minSize: 200,
        // sortDescFirst: true,
        //     cell: ({ row }) => row.original.title || "No Title",
        // },
        {
            accessorKey: "actionItems",
            header: "Action Items",
            enableResizing: true,
            size: 200,
            minSize: 150,
            sortDescFirst: true,
            cell: ({ row }) => (
                <div
                    className={`${styles.customtruncatetwolines}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title={row.original.actionItems || "No Action Items"}

                >
                    {row.original.actionItems || "No Action Items"}
                </div>
            )

        },
        {
            accessorKey: "clientFullName",
            header: "Client Name",
            enableResizing: true,
            size: 130,
            minSize: 100,
            sortDescFirst: true,
            cell: ({ row }) => row.original.client?.fullName || "N/A",
        },
        {
            accessorKey: "advisorFullName",
            header: "Advisor Name",
            enableResizing: true,
            size: 150,
            minSize: 150,
            sortDescFirst: true,
            cell: ({ row }) => row.original.advisor?.advisorFullName || "N/A",
        },
        {
            accessorKey: "date",
            header: "Meeting Date",
            enableResizing: true,
            size: 140,
            minSize: 120,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.date ? new Date(row.original.date).toLocaleDateString("en-GB") : "N/A",
        },
        {
            accessorKey: "status",
            header: "Status",
            enableResizing: true,
            size: 125,
            minSize: 100,
            sortDescFirst: true,
            cell: ({ row, getValue }) => {
                const value = getValue();
                const id = row.original._id;

                const handleStatusChange = async (e) => {
                    const newStatus = e.target.value;
                    try {
                        await axios.patch(`${url}/admin/rowwisetasks/${id}/editRowWiseTasks`, {
                            status: newStatus,
                        });

                        console.log("Row-wise Task Status updated successfully!");

                        setRowWiseTasks((prevTasks) =>
                            prevTasks.map((task) =>
                                task._id === id ? { ...task, status: newStatus } : task
                            )
                        );

                        // setFilteredRowWiseTasks((prevTasks) =>
                        //     prevTasks.map((task) =>
                        //         task._id === id ? { ...task, status: newStatus } : task
                        //     )
                        // );

                    } catch (error) {
                        console.error("Error updating row-wise task status:", error);
                    }
                };

                let statusClass = "";
                if (value === "Completed") statusClass = styles["completed-status"];
                else if (value === "Pending") statusClass = styles["pending-status"];
                else if (value === "Overdue") statusClass = styles["overdue-status"];

                return (
                    <select
                        className={`form-select form-select-sm ${statusClass}`}
                        value={value || ""}
                        onChange={handleStatusChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                );
            }
        },
        {
            accessorKey: "responsiblePerson",
            header: "Responsible Person",
            enableResizing: true,
            size: 170,
            minSize: 150,
            sortDescFirst: true,
            cell: ({ row }) => row.original.responsiblePerson || "N/A",
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            enableResizing: true,
            size: 110,
            minSize: 100,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString("en-GB") : "N/A",
        },
        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 140,
            minSize: 100,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#showRowWiseTaskModal"
                        onClick={() => setCurrentItem({
                            actionItems: row.original.actionItems,
                            status: row.original.status,
                            client: row.original.client?.fullName,
                            advisor: row.original.advisor?.advisorFullName,
                            responsiblePerson: row.original.responsiblePerson,
                            dueDate: row.original.dueDate
                        })}
                    >
                        <LuNotebook className="d-block fs-6" />
                    </button>

                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#editTaskModal"
                        onClick={() => openEditModal(row.original._id)}
                    >
                        <FaRegEdit className="d-block fs-6" />
                    </button>


                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => setTargetId(row.original._id)}
                    >
                        {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
                    </button>
                </div>
            ),
        }


    ];

    return (
        <div className="container-fluid">
            <div className='d-flex align-items-center justify-content-between '>

                <div className='d-flex align-items-center justify-content-start mb-3 '>
                    <div>
                        <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>All Tasks</h4>
                        <p className={`  ${styles.taskHeaderItem}`}>Manage and track tasks for all clients and advisors</p>
                    </div>

                </div>

                <button
                    className="btn btn-custom-turtle-background"
                    data-bs-toggle="modal"
                    data-bs-target="#addTaskModal"
                >
                    Create New Task
                </button>

            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>

                    <div className='mb-4 align-items-center row gx-3 gy-3 gy-lg-0'>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="d-flex gap-2 align-items-center fs-5 fw-bold">
                                    <GrStatusGood className="d-block text-success " />
                                    Completed
                                </h4>
                                <p className="fs-6 mb-2">Tasks which are done</p>
                                <h2 className='fs-4 m-0 fw-bolder'>{taskStats.completed}</h2>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="d-flex gap-2 align-items-center fs-5 fw-bold">
                                    <FaRegClock className="d-block text-danger " />
                                    Pending
                                </h4>
                                <p className="fs-6 mb-2">Tasks pending completion</p>
                                <h2 className='fs-4 m-0 fw-bolder'>{taskStats.pending}</h2>
                            </div>
                        </div>



                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="d-flex gap-2 align-items-center fs-5 fw-bold">
                                    <MdOutlineErrorOutline className="d-block text-warning fs-4" />
                                    Overdue
                                </h4>
                                <p className="fs-6 mb-2">Tasks past due date</p>
                                <h2 className='fs-4 m-0 fw-bolder'>{taskStats.overdue}</h2>
                            </div>
                        </div>

                    </div>

                    <div className="row my-4">
                        <div className="col-12 col-md-6 d-flex align-items-center gap-3 flex-wrap">
                            <div className="d-flex align-items-center gap-2">
                                <label className="fw-semibold mb-0">Advisor:</label>
                                <Select
                                    options={[{ label: "All Advisors", value: "" }, ...advisorsList.map(advisor => ({ label: advisor, value: advisor }))]}
                                    value={{ label: selectedAdvisor || "All Advisors", value: selectedAdvisor }}
                                    onChange={(selectedOption) => setSelectedAdvisor(selectedOption?.value || "")}
                                    className="react-select-container border rounded-3"
                                    classNamePrefix="react-select"
                                    styles={{ container: base => ({ ...base, width: '180px' }) }}
                                    isClearable
                                />
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <label className="fw-semibold mb-0">Client:</label>
                                <Select
                                    options={[{ label: "All Clients", value: "" }, ...clientsList.map(client => ({ label: client, value: client }))]}
                                    value={{ label: selectedClient || "All Clients", value: selectedClient }}
                                    onChange={(selectedOption) => setSelectedClient(selectedOption?.value || "")}
                                    className="react-select-container border rounded-3"
                                    classNamePrefix="react-select"
                                    styles={{ container: base => ({ ...base, width: '180px' }) }}
                                    isClearable
                                />
                            </div>
                        </div>
                    </div>




                    <div className={styles.rowWiseTasksPageTableWrapper}>

                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle  px-3 bg-light-subtle">

                            <div className="my-3 bg-light-subtle d-flex justify-content-between " >
                                <div className="">
                                    <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                                </div>

                                <div>
                                    <button className="d-flex align-items-center justify-content-between text-align-center btn btn-outline-turtle-secondary ">
                                        <IoFilter className="text-align-center me-2" />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <TableComponent
                                data={rowWiseTasks}
                                columns={columns} // make sure `columns` is defined above or imported
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
                                setPageSize={setPageSize}
                                totalCount={totalCount}
                                sorting={sorting}
                                setSorting={setSorting}
                                className={`${styles["custom-style-table"]}`}
                                isLoading={isLoading}
                                setColumnFilter={setColumnFilter}
                            />


                            <DeleteModal
                                modalId="deleteModal"
                                headerText="Confirm Deletion"
                                bodyContent="Are you sure you want to delete this Task?"
                                confirmButtonText="Delete"
                                onConfirm={() => handleDelete(targetId)}
                            />

                            <ShowrowwisetaskModal
                                modalId="showRowWiseTaskModal"
                                item={currentItem}
                                statusClasses={{
                                    completed: styles["completed-status"],
                                    pending: styles["pending-status"],
                                    overdue: styles["overdue-status"]
                                }}
                            />


                            <EditTaskModal
                                id={selectedTaskId}
                                url={url}
                                clients={clients}
                                advisors={advisors}
                                onSuccess={handleTaskUpdate}
                            />

                            <AddTaskModal
                                clients={clients}
                                advisors={advisors}
                                onSuccess={handleAddTaskSuccess}
                            />




                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default AllTasks;
