import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../TableComponent";
import SearchFilter from "../SearchFilter";
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import DeleteModal from "../DeleteModal";

const ClientMeetingTab = ({ clientId, onEditMeeting }) => {
    const url = import.meta.env.VITE_URL;

    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");

    // Delete state
    const [targetId, setTargetId] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const [deleteType, setDeleteType] = useState("");

    // Pagination & Sorting
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [pageIndex, setPageIndex] = useState(0);
    const [sorting, setSorting] = useState([]);

    // Fetch meetings whenever filters/pagination changes
    useEffect(() => {
        if (!clientId) return;
        fetchMeetings(pageIndex, pageSize, sorting, columnFilter);
    }, [clientId, pageIndex, pageSize, sorting, columnFilter]);

    const fetchMeetings = async (page, size, sorting, search) => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "createdAt";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/admin/clients/${clientId}/tasks`, {
                params: { page: page + 1, limit: size, sortField, sortOrder, search },
            });

            setMeetings(res.data.tasks);
            setTotalCount(res.data.total || 0);
        } catch (err) {
            console.error("Error fetching meetings:", err);
            setError("Failed to fetch meetings");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete meeting
    const handleDelete = async () => {
        if (!targetId || deleteType !== "meeting") return;

        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/admin/tasks/${targetId}`);
            setMeetings((prev) => prev.filter((m) => m._id !== targetId));
        } catch (err) {
            console.error("Error deleting meeting:", err);
            alert("Error deleting the meeting");
        } finally {
            setLoadingId(null);
            setTargetId(null);
            setDeleteType("");
        }
    };

    // Table columns
    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            enableResizing: true,
            size: 200,
            minSize: 200,
            sortDescFirst: true,
        },
        {
            accessorKey: "clientFullName",
            header: "Client Name",
            enableResizing: true,
            size: 140,
            minSize: 100,
            sortDescFirst: true,
            cell: ({ row }) => row.original.client?.fullName || "N/A",
        },
        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 200,
            minSize: 200,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    {/* Edit */}
                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        onClick={() => onEditMeeting(row.original._id)}
                    >
                        <FaRegEdit className="d-block fs-6" />
                    </button>

                    {/* Delete */}
                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => {
                            setTargetId(row.original._id);
                            setDeleteType("meeting");
                        }}
                        disabled={loadingId === row.original._id}
                    >
                        {loadingId === row.original._id ? (
                            "Deleting..."
                        ) : (
                            <RiDeleteBin6Line className="d-block fs-6" />
                        )}
                    </button>

                    {/* Transcript/Video */}
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
            ),
        },
    ];

    return (
        <div className="p-2">
            {isLoading ? (
                <p>Loading meetings...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <>
                    <div className="d-flex justify-content-between mb-3">
                        <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                        <button className="btn btn-outline-secondary d-flex align-items-center">
                            <IoFilter className="me-2" /> Filter
                        </button>
                    </div>

                    <TableComponent
                        data={meetings}
                        columns={columns}
                        pageSize={pageSize}
                        pageIndex={pageIndex}
                        setPageIndex={setPageIndex}
                        setPageSize={setPageSize}
                        totalCount={totalCount}
                        sorting={sorting}
                        setSorting={setSorting}
                    />

                    {/* Delete Modal */}
                    <DeleteModal
                        modalId="deleteModal"
                        headerText="Confirm Deletion"
                        bodyContent="Are you sure you want to delete this Meeting?"
                        confirmButtonText="Delete"
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default ClientMeetingTab;
