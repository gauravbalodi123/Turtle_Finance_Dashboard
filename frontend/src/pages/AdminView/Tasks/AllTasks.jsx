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

const AllMeetings = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const [rowWiseTasks, setRowWiseTasks] = useState([]);
    const [filteredRowWiseTasks, setFilteredRowWiseTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [taskStats, setTaskStats] = useState({
        overdue: 0,
        pending: 0,
        completed: 0,
    });




    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${url}/admin/rowwisetasks`);
            const reversedData = res.data.reverse();

            const counts = {
                overdue: 0,
                pending: 0,
                completed: 0,
            };

            const today = new Date();
            const updatedTasks = await Promise.all(
                reversedData.map(async (task) => {
                    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                    const status = task.status?.toLowerCase();

                    if (dueDate && dueDate < today && status !== "overdue" && status !== "completed") {
                        // Update status in backend
                        try {
                            await axios.patch(`${url}/admin/rowwisetasks/${task._id}/editRowWiseTasks`, {
                                status: "Overdue",
                            });
                            task.status = "Overdue";
                            counts.overdue++;
                        } catch (err) {
                            console.error(`Failed to update task ${task._id} to overdue`, err);
                        }
                    } else {
                        // Count based on current status
                        if (status === "overdue") counts.overdue++;
                        else if (status === "pending") counts.pending++;
                        else if (status === "completed") counts.completed++;
                    }

                    return task;
                })
            );

            setRowWiseTasks(updatedTasks);
            setFilteredRowWiseTasks(updatedTasks);
            setTaskStats(counts);
        } catch (err) {
            setError("Failed to fetch rowwisetasks");
        } finally {
            setIsLoading(false);
        }
    };



    const handleDelete = async (id) => {
        setLoadingId(id);
        try {
            await axios.delete(`${url}/admin/rowwisetasks/${id}`);
            alert("Row-wise task has been deleted successfully");
            setRowWiseTasks((currTasks) => currTasks.filter((task) => task._id !== id));
        } catch (e) {
            console.log(e);
            alert("Error deleting the row-wise task");
        } finally {
            setLoadingId(null);

        }
    };

    useEffect(() => {
        if (!columnFilter) {
            setFilteredRowWiseTasks(rowWiseTasks);
            return;
        }

        const lowerCaseFilter = columnFilter.toLowerCase();

        const filteredData = rowWiseTasks.filter((task) =>
            Object.values(task).some(
                (value) =>
                    value &&
                    value.toString().toLowerCase().includes(lowerCaseFilter)
            )
        );

        setFilteredRowWiseTasks(filteredData);
    }, [columnFilter, rowWiseTasks]);

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            enableResizing: true,
            size: 400,
            minSize: 300,
            cell: ({ row }) => row.original.title || "No Title",
        },
        {
            accessorKey: "actionItems",
            header: "Action Items",
            enableResizing: true,
            size: 400,
            minSize: 300,
            cell: ({ row }) => row.original.actionItems || "No Action Items",
        },
        {
            accessorKey: "client.fullName",
            header: "Client Name",
            enableResizing: true,
            size: 200,
            minSize: 150,
            cell: ({ row }) => row.original.client?.fullName || "N/A",
        },
        {
            accessorKey: "client.email",
            header: "Client Email",
            enableResizing: true,
            size: 220,
            minSize: 180,
            cell: ({ row }) => row.original.client?.email || "N/A",
        },
        {
            accessorKey: "advisor.advisorFullName",
            header: "Advisor Name",
            enableResizing: true,
            size: 200,
            minSize: 150,
            cell: ({ row }) => row.original.advisor?.advisorFullName || "N/A",
        },
        {
            accessorKey: "date",
            header: "Meeting Date",
            enableResizing: true,
            size: 150,
            minSize: 120,
            cell: ({ row }) =>
                row.original.date ? new Date(row.original.date).toLocaleDateString("en-GB") : "N/A",
        },
        {
            accessorKey: "status",
            header: "Status",
            enableResizing: true,
            size: 120,
            minSize: 100,
        },
        {
            accessorKey: "responsiblePerson",
            header: "Responsible Person",
            enableResizing: true,
            size: 230,
            minSize: 150,
            cell: ({ row }) => row.original.responsiblePerson || "N/A",
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            enableResizing: true,
            size: 150,
            minSize: 120,
            cell: ({ row }) =>
                row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString("en-GB") : "N/A",
        },
        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 150,
            minSize: 120,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <Link to={`/adminautharized/admin/rowwisetasks/${row.original._id}/editRowWiseTasks`} className="btn   p-2  btn-outline-turtle-secondary ">
                        <FaRegEdit className="d-block fs-6" />
                    </Link>
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        disabled={loadingId === row.original._id}
                        className="btn  p-2  btn-outline-turtle-secondary "
                    >
                        {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
                    </button>
                </div>

            ),
        },
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

                <Link to="addTask">
                    <button className="btn btn-custom-turtle-background">Create New Task</button>
                </Link>
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
                                <label className="fw-semibold mb-0">Status:</label>
                                <select className="form-select form-select-sm rounded-3" style={{ width: '150px' }}>
                                    <option>All Advisors</option>
                                    {/* Add other options here */}
                                </select>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <label className="fw-semibold mb-0">Group By:</label>
                                <select className="form-select form-select-sm rounded-3" style={{ width: '150px' }}>
                                    <option>All Clients</option>
                                    {/* Add other options here */}
                                </select>
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
                                data={filteredRowWiseTasks}
                                columns={columns}
                                pageSize={10}
                                className={`${styles["custom-style-table"]}`}
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default AllMeetings;
