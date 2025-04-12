import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parrot from '../../assets/animation/parrot.json'
import TableComponent from '../../components/SmallerComponents/TableComponent'
import styles from '../../styles/Meetings/AllMeetings.module.css'
import { FaEdit, FaTrash } from "react-icons/fa";
import SearchFilter from '../../components/SmallerComponents/SearchFilter'
import TaskModal from "../../components/SmallerComponents/TaskModal";


const AllMeetings = () => {
    const url = process.env.REACT_APP_HOSTED_URL;
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
            const res = await axios.get(`${url}/tasks`);
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
                            await axios.patch(`${url}/tasks/${task._id}/editTasks`, {
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


    const handleDelete = async (id) => {

        setLoadingId(id);
        try {

            await axios.delete(`${url}/tasks/${id}`)
            alert("task has been deleted successfully");
            setTasks((currTasks) => currTasks.filter((task) => task._id !== id));
        }
        catch (e) {
            console.log(e);
            alert("error deleting the task")
        }
        finally {
            setLoadingId(null);
        }
    }


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
            size: 400,
            minSize: 300,
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
            accessorKey: "advisor.email",
            header: "Advisor Email",
            enableResizing: true,
            size: 220,
            minSize: 180,
            cell: ({ row }) => row.original.advisor?.email || "N/A",
        },
        {
            accessorKey: "transcriptUrl",
            header: "Transcript URL",
            enableResizing: true,
            size: 250,
            minSize: 150,
            cell: ({ row }) =>
                row.original.transcriptUrl ? (
                    <a href={row.original.transcriptUrl} target="_blank" rel="noopener noreferrer">
                        View Transcript
                    </a>
                ) : (
                    "N/A"
                ),
        },
        {
            accessorKey: "videoUrl",
            header: "Video URL",
            enableResizing: true,
            size: 250,
            minSize: 150,
            cell: ({ row }) =>
                row.original.videoUrl ? (
                    <a href={row.original.videoUrl} target="_blank" rel="noopener noreferrer">
                        Download Video
                    </a>
                ) : (
                    "N/A"
                ),
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
            accessorKey: "meetingNumber",
            header: "Meeting Number",
            enableResizing: true,
            size: 200,
            minSize: 120,
        },
        {
            accessorKey: "actionItems",
            header: "Action Items",
            enableResizing: true,
            size: 200,
            minSize: 150,
            cell: ({ row }) => (
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleOpenModal("Action Items", row.original.actionItems || "No Action Items")}
                >
                    View
                </button>
            ),
        },
        {
            accessorKey: "detailedNotes",
            header: "Detailed Notes",
            enableResizing: true,
            size: 200,
            minSize: 150,
            cell: ({ row }) => (
                <button
                    className="btn btn-sm  btn-outline-primary"
                    onClick={() => handleOpenModal("Detailed Notes", row.original.detailedNotes || "No Detailed Notes")}
                >
                    View
                </button>
            ),
        },
        {
            accessorKey: "summary",
            header: "Summary",
            enableResizing: true,
            size: 200,
            minSize: 150,
            cell: ({ row }) => (
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleOpenModal("Summary", row.original.summary || "No Summary")}
                >
                    View
                </button>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            enableResizing: true,
            size: 120,
            minSize: 100,
        },
        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 150,
            minSize: 120,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <Link to={`/tasks/${row.original._id}/editTasks`} className="btn btn-primary btn-sm">
                        <FaEdit />
                    </Link>
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        disabled={loadingId === row.original._id}
                        className="btn btn-danger btn-sm"
                    >
                        {loadingId === row.original._id ? "Deleting..." : <FaTrash />}
                    </button>
                </div>
            ),
        },
    ];





    return (
        <div className="container-fluid  ">

            <div className='d-flex align-items-center justify-content-start mb-3 '>
                <div>
                    <h2 className={`  ${styles.taskHeaderItem}`}>Meetings</h2>
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


                    <div className='mb-4 align-items-center row gx-3 gy-3 gy-lg-0 '>

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
                    </div>

                    <div className={styles.tasksPageTableWrapper}>

                        <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} />

                        <div className="table-responsive">
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

        </div>
    )
}

export default AllMeetings;