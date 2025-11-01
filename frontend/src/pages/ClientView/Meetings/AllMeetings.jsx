import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import parrot from "../../../assets/animation/parrot.json";
import TableComponent from "../../../components/SmallerComponents/TableComponent";
import styles from "../../../styles/AdminLayout/Meetings/AllMeetings.module.css";
import SearchFilter from "../../../components/SmallerComponents/SearchFilter";
import TaskModal from "../../../components/SmallerComponents/TaskModal";
import { IoFilter } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { PiClipboardTextLight } from "react-icons/pi";
import { GrNotes } from "react-icons/gr";
import DeleteModal from "../../../components/SmallerComponents/DeleteModal";
import ActionItemsModal from "../../../components/SmallerComponents/ActionItemsModal";
import EditModal from "../../../components/SmallerComponents/EditModal";
import Select from "react-select";

const AllMeetings = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    const [advisorsList, setAdvisorsList] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState("");

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [sorting, setSorting] = useState([]);

    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [currentActionItems, setCurrentActionItems] = useState([]);
    const [targetId, setTargetId] = useState(null);
    const [deleteType, setDeleteType] = useState("");
    const [selectedActionItem, setSelectedActionItem] = useState(null);
    const [currentTaskId, setCurrentTaskId] = useState(null);

    // ✅ fetch advisor list for dropdown
    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const res = await axios.get(`${url}/client/advisors`);
                // expecting array of advisors with advisorFullName
                const advisorNames = res.data.map((a) => a.advisorFullName).filter(Boolean);
                setAdvisorsList(advisorNames);
            } catch (err) {
                console.error("Failed to fetch advisors:", err);
            }
        };
        fetchAdvisors();
    }, []);

    // ✅ fetch meetings whenever filters or pagination change
    useEffect(() => {
        fetchTasks(pageIndex, pageSize, sorting, columnFilter, selectedAdvisor);
    }, [pageIndex, pageSize, sorting, columnFilter, selectedAdvisor]);

    const fetchTasks = async (
        page = 0,
        size = 10,
        sorting = [],
        search = "",
        advisorFilter = ""
    ) => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/client/selectiveTasks`, {
                params: {
                    page: page + 1,
                    limit: size,
                    sortField,
                    sortOrder,
                    search,
                    advisor: advisorFilter, // ✅ send selected advisor
                },
            });

            setTasks(res.data.tasks);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch client meetings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!targetId || !deleteType) return;
        setLoadingId(targetId);
        try {
            if (deleteType === "meeting") {
                await axios.delete(`${url}/client/tasks/${targetId}`);
                setTasks((currTasks) => currTasks.filter((t) => t._id !== targetId));
            } else if (deleteType === "actionItem") {
                await axios.delete(`${url}/client/rowwisetasks/${targetId}`);
                setCurrentActionItems((curr) => curr.filter((i) => i._id !== targetId));
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting the item");
        } finally {
            setLoadingId(null);
            setTargetId(null);
            setDeleteType("");
        }
    };

    const handleOpenModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
    };

    const handleOpenActionItemsModal = async (parentId) => {
        try {
            setCurrentTaskId(parentId);
            const res = await axios.get(`${url}/client/rowwisetasks/parent/${parentId}`);
            setCurrentActionItems(res.data || []);
        } catch (err) {
            console.error("Failed to fetch action items", err);
            setCurrentActionItems([]);
        }
    };

    const handleEditActionItem = async (itemId) => {
        try {
            const res = await axios.get(`${url}/client/rowwisetasks/${itemId}/editRowWiseTasks`);
            setSelectedActionItem(res.data || {});
        } catch (err) {
            console.error("Failed to fetch action item for edit", err);
            setSelectedActionItem({});
        }
    };

    const handleSaveEditedActionItem = async (updatedData) => {
        if (!updatedData || !updatedData._id) return;
        try {
            const { _id, ...updateFields } = updatedData;
            await axios.patch(`${url}/client/rowwisetasks/${_id}/editRowWiseTasks`, updateFields);
            await handleOpenActionItemsModal(currentTaskId);
            const modal = window.bootstrap.Modal.getInstance(document.getElementById("editModal"));
            if (modal) modal.hide();
        } catch (err) {
            console.error("Failed to save edited action item", err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`${url}/client/rowwisetasks/${id}/editRowWiseTasks`, {
                status: newStatus,
            });
            setCurrentActionItems((prev) =>
                prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
            );
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            size: 200,
        },
        {
            accessorKey: "advisorName",
            header: "Advisor",
            cell: ({ row }) => row.original.advisor?.advisorFullName || "N/A",
        },
        {
            accessorKey: "date",
            header: "Meeting Date",
            cell: ({ row }) =>
                row.original.date
                    ? new Date(row.original.date).toLocaleDateString("en-GB")
                    : "N/A",
        },
        {
            accessorKey: "actionItems",
            header: "Action Items",
            cell: ({ row }) => (
                <a
                    className="text-turtle-primary text-decoration-none d-flex align-items-center gap-2 fs-6 cursor-pointer"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#actionItemsModal"
                    onClick={() => handleOpenActionItemsModal(row.original._id)}
                >
                    <PiClipboardTextLight className="d-block fs-5" />
                    View Items
                </a>
            ),
        },
        {
            accessorKey: "detailedNotes",
            header: "Detailed Notes",
            cell: ({ row }) => (
                <a
                    className="text-turtle-primary text-decoration-none d-flex align-items-center gap-2 fs-6 cursor-pointer"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#taskModal"
                    onClick={() =>
                        handleOpenModal("Detailed Notes", row.original.detailedNotes || "No Detailed Notes")
                    }
                >
                    <GrNotes className="d-block fs-6" />
                    View Notes
                </a>
            ),
        },
        {
            accessorKey: "_id",
            header: "Action",
            size: 80,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    {row.original.transcriptUrl && (
                        <a
                            href={row.original.transcriptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn p-2 btn-outline-turtle-secondary"
                        >
                            <FaRegEye className="d-block fs-6" />
                        </a>
                    )}
                    {row.original.videoUrl && (
                        <a
                            href={row.original.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn p-2 btn-outline-turtle-secondary"
                        >
                            <FaDownload className="d-block fs-6" />
                        </a>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-start">
                <div>
                    <h4 className={`${styles.taskHeaderItem} fw-bold mb-1`}>My Meetings</h4>
                    <p className={`${styles.taskHeaderItem}`}>
                        View and track your meetings with your advisors
                    </p>
                </div>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>
                    {/* ✅ Advisor filter dropdown */}
                    <div className="row my-4">
                        <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                            <label className="fw-semibold mb-0">Advisor:</label>
                            <Select
                                options={[{ label: "All Advisors", value: "" }, ...advisorsList.map(a => ({ label: a, value: a }))]}
                                value={{ label: selectedAdvisor || "All Advisors", value: selectedAdvisor }}
                                onChange={(opt) => setSelectedAdvisor(opt?.value || "")}
                                className="react-select-container border rounded-3"
                                classNamePrefix="react-select"
                                styles={{ container: base => ({ ...base, width: '180px' }) }}
                                isClearable
                            />
                        </div>
                    </div>

                    <div className={styles.tasksPageTableWrapper}>
                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle px-3 bg-light-subtle">
                            <div className="my-3 bg-light-subtle d-flex justify-content-between">
                                <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                                <button className="d-flex align-items-center btn btn-outline-turtle-secondary">
                                    <IoFilter className="me-2" /> Filter
                                </button>
                            </div>

                            <TableComponent
                                data={tasks}
                                columns={columns}
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
                                setPageSize={setPageSize}
                                totalCount={totalCount}
                                sorting={sorting}
                                setSorting={setSorting}
                            />

                            <TaskModal modalId="taskModal" headerText={modalTitle} bodyContent={modalContent} />

                            <DeleteModal
                                modalId="deleteModal"
                                headerText="Confirm Deletion"
                                bodyContent="Are you sure you want to delete this meeting?"
                                confirmButtonText="Delete"
                                onConfirm={handleDelete}
                            />

                            <ActionItemsModal
                                modalId="actionItemsModal"
                                headerText="Action Items"
                                actionItems={currentActionItems}
                                onEdit={handleEditActionItem}
                                onDelete={(id) => {
                                    setTargetId(id);
                                    setDeleteType("actionItem");
                                }}
                                onStatusChange={handleStatusChange}
                                statusClasses={{
                                    completed: styles["completed-status"],
                                    pending: styles["pending-status"],
                                    overdue: styles["overdue-status"],
                                }}
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default AllMeetings;
