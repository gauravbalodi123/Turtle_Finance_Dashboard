import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parrot from '../../../assets/animation/parrot.json'
import TableComponent from '../../../components/SmallerComponents/TableComponent';
import styles from '../../../styles/AdminLayout/Meetings/AllMeetings.module.css'
// import { FaEdit, FaTrash } from "react-icons/fa";
import SearchFilter from '../../../components/SmallerComponents/SearchFilter'
import TaskModal from '../../../components/SmallerComponents/TaskModal';
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiClipboardTextLight } from "react-icons/pi";
import { GrNotes } from "react-icons/gr";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import DeleteModal from "../../../components/SmallerComponents/DeleteModal";


const AllMeetings = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]); // ✅ New state for filtered data
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState(""); // ✅ Search filter state
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [meetingStats, setMeetingStats] = useState({
        overdue: 0,
        pending: 0,
        inProgress: 0,
    });
    const [targetId, setTargetId] = useState(null);


    const handleOpenModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setShowModal(true);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${url}/admin/tasks`);
            const reversedData = res.data.reverse();

            const counts = {
                overdue: 0,
                pending: 0,
                inProgress: 0,
            };

            const today = new Date();
            const updatedTasks = await Promise.all(
                reversedData.map(async (task) => {
                    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                    const status = task.status?.toLowerCase();

                    if (dueDate && dueDate < today && status !== "overdue") {
                        // Update to overdue in backend
                        try {
                            await axios.patch(`${url}/admin/tasks/${task._id}/editTasks`, {
                                status: "Overdue",
                            });
                            task.status = "Overdue";
                            counts.overdue++;
                        } catch (err) {
                            console.error(`Failed to mark task ${task._id} as overdue`, err);
                        }
                    } else {
                        if (status === "overdue") counts.overdue++;
                        else if (status === "pending") counts.pending++;
                        else if (status === "in progress" || status === "inprogress") counts.inProgress++;
                    }

                    return task;
                })
            );

            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);
            setMeetingStats(counts);
        } catch (err) {
            setError("Failed to fetch tasks");
        } finally {
            setIsLoading(false);
        }
    };


    const handleDelete = async () => {
        if (!targetId) return;

        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/admin/tasks/${targetId}`);
            setTasks((currTasks) => currTasks.filter((task) => task._id !== targetId));
        } catch (e) {
            console.log(e);
            alert("Error deleting the task");
        } finally {
            setLoadingId(null);
            setTargetId(null); // Reset the target after deletion
        }
    };



    useEffect(() => {
        if (!columnFilter) {
            setFilteredTasks(tasks); // Reset when filter is empty
            return;
        }

        const lowerCaseFilter = columnFilter.toLowerCase();

        const filteredData = tasks.filter((task) =>
            Object.values(task).some(
                (value) =>
                    value &&
                    value.toString().toLowerCase().includes(lowerCaseFilter)
            )
        );

        setFilteredTasks(filteredData);
    }, [columnFilter, tasks]);

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            enableResizing: true,
            size: 200,
            minSize: 200,
        },
        {
            accessorKey: "client.fullName",
            header: "Client Name",
            enableResizing: true,
            size: 140,
            minSize: 100,
            cell: ({ row }) => row.original.client?.fullName || "N/A",
        },
        {
            accessorKey: "advisor.advisorFullName",
            header: "Advisor Name",
            enableResizing: true,
            size: 140,
            minSize: 100,
            cell: ({ row }) => row.original.advisor?.advisorFullName || "N/A",
        },
        {
            accessorKey: "date",
            header: "Meeting Date",
            enableResizing: true,
            size: 140,
            minSize: 120,
            cell: ({ row }) =>
                row.original.date ? new Date(row.original.date).toLocaleDateString("en-GB") : "N/A",
        },
        {
            accessorKey: "meetingNumber",
            header: "Meeting Number",
            enableResizing: true,
            size: 160,
            minSize: 120,
        },
        {
            accessorKey: "actionItems",
            header: "Action Items",
            enableResizing: true,
            size: 130,
            minSize: 100,
            cell: ({ row }) => (
                <a
                    className="text-turtle-primary text-decoration-none d-flex align-items-center gap-2 fs-6 cursor-pointer" role="button"
                    onClick={() => handleOpenModal("Action Items", row.original.actionItems || "No Action Items")}
                >
                    <PiClipboardTextLight className="d-block fs-5" />
                    View Items
                </a>
            ),
        },
        {
            accessorKey: "detailedNotes",
            header: "Detailed Notes",
            enableResizing: true,
            size: 140,
            minSize: 100,
            cell: ({ row }) => (
                <a
                    className="text-turtle-primary text-decoration-none d-flex align-items-center gap-2 fs-6 " role="button"
                    onClick={() => handleOpenModal("Detailed Notes", row.original.detailedNotes || "No Detailed Notes")}
                >
                    <GrNotes className="d-block fs-6" />
                    View Notes
                </a>
            ),
        },
        {
            accessorKey: "summary",
            header: "Summary",
            enableResizing: true,
            size: 150,
            minSize: 100,
            cell: ({ row }) => (
                <a
                    className="text-turtle-primary text-decoration-none d-flex align-items-center gap-2 fs-6 " role="button"
                    onClick={() => handleOpenModal("Summary", row.original.summary || "No Summary")}
                >
                    <RiStickyNoteAddLine className="d-block fs-5" />
                    View Summary
                </a>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            enableResizing: true,
            size: 100,
            minSize: 100,
        },
        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 200,
            minSize: 200,
            cell: ({ row }) => (
                <div className="d-flex  gap-2">
                    <div className="d-flex gap-2">
                        <Link
                            to={`/adminautharized/admin/tasks/${row.original._id}/editTasks`}
                            className="btn p-2 btn-outline-turtle-secondary"
                        >
                            <FaRegEdit className="d-block fs-6" />
                        </Link>
                        <button
                            type="button"
                            className="btn p-2 btn-outline-turtle-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                            onClick={() => setTargetId(row.original._id)}
                            disabled={loadingId === row.original._id}
                        >
                            {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
                        </button>
                    </div>
                    <div className="d-flex gap-2">
                        {row.original.transcriptUrl ? (
                            <a
                                href={row.original.transcriptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn p-2 btn-outline-turtle-secondary"
                            >
                                <FaRegEye className="d-block fs-6" />
                            </a>
                        ) : (
                            <span className="small text-muted">Transcript: N/A</span>
                        )}
                        {row.original.videoUrl ? (
                            <a
                                href={row.original.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn p-2 btn-outline-turtle-secondary"
                            >
                                <FaDownload className="d-block fs-6" />
                            </a>
                        ) : (
                            <span className="small text-muted">Video: N/A</span>
                        )}
                    </div>
                </div>
            ),
        }

    ];





    return (
        <div className="container-fluid  ">

            <div className='d-flex align-items-center justify-content-start  '>
                <div>
                    <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>Meetings</h4>
                    <p className={`  ${styles.taskHeaderItem}`}>Manage and track meetings for all clients and advisors</p>
                </div>

                {/* <div>
                    <button type='' className={`btn btn-custom-turtle-background`}>Create New Meeting</button>
                </div> */}
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>


                    {/* <div className='mb-4 align-items-center row gx-3 gy-3 gy-lg-0 '>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-3 ${styles}`}>
                                <h4>In Progress</h4>
                                <p>Tasks past due date</p>
                                <h2 className='m-0'>{meetingStats.inProgress}</h2>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card  p-3 ${styles}`}>
                                <h4>Pending</h4>
                                <p>Tasks past due date</p>
                                <h2 className='m-0'>{meetingStats.pending}</h2>
                            </div>
                        </div>

                        <div className="col-12  col-lg-4 text-center text-md-start ">
                            <div className={` card p-3 ${styles}`}>
                                <h4>Overdue</h4>
                                <p>Tasks past due date</p>
                                <h2 className='m-0'>{meetingStats.overdue}</h2>
                            </div>
                        </div>
                    </div> */}

                    <div className="row my-4">
                        <div className="col-12 col-md-6 d-flex align-items-center gap-3 flex-wrap">
                            <div className="d-flex align-items-center gap-2">
                                <label className="fw-semibold mb-0">Advisor:</label>
                                <select className="form-select form-select-sm rounded-3" style={{ width: '150px' }}>
                                    <option>All Advisors</option>
                                    {/* Add other options here */}
                                </select>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <label className="fw-semibold mb-0">Client:</label>
                                <select className="form-select form-select-sm rounded-3" style={{ width: '150px' }}>
                                    <option>All Clients</option>
                                    {/* Add other options here */}
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className={styles.tasksPageTableWrapper}>



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

                            <TableComponent data={filteredTasks}
                                columns={columns}
                                pageSize={10}
                                className={`${styles["custom-style-table"]}`}
                            />
                        </div>

                    </div>

                </Fragment>
            )}

            <TaskModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={modalTitle}
                content={modalContent}
            />

            <DeleteModal
                modalId="deleteModal"
                headerText="Confirm Deletion"
                bodyContent="Are you sure you want to delete this Meeting?"
                confirmButtonText="Delete"
                onConfirm={() => handleDelete(targetId)}
            />

        </div>
    )
}

export default AllMeetings;