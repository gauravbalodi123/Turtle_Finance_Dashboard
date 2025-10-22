import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { IoFilter } from "react-icons/io5";
import SearchFilter from "../../../components/SmallerComponents/SearchFilter";
import TableComponent from "../../../components/SmallerComponents/TableComponent";
import styles from "../../../styles/AdminLayout/AllEmailTracker/AllEmailTracker.module.css";
import { FaListUl, FaTh } from "react-icons/fa";

const MilestoneTracker = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    // 🆕 toggle state
    const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" | "history"

    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [historyEmails, setHistoryEmails] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [sorting, setSorting] = useState([]);
    const [columnFilter, setColumnFilter] = useState("");

    const [historyPageSize, setHistoryPageSize] = useState(10);
    const [historyPageIndex, setHistoryPageIndex] = useState(0);
    const [historySorting, setHistorySorting] = useState([]);
    const [historyColumnFilter, setHistoryColumnFilter] = useState("");
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        fetchTrackerData(pageIndex, pageSize, sorting, columnFilter);
    }, [pageIndex, pageSize, sorting, columnFilter]);

    const fetchTrackerData = async (page = 0, size = 10, sorting = [], search = "") => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/admin/email-tracker`, {
                params: { page: page + 1, limit: size, search, sortField, sortOrder },
            });

            setEmails(res.data);
            setTotalCount(res.data.length);
        } catch (err) {
            setError("Failed to fetch tracker data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryData(historyPageIndex, historyPageSize, historySorting, historyColumnFilter);
    }, [historyPageIndex, historyPageSize, historySorting, historyColumnFilter]);

    const fetchHistoryData = async (page = 0, size = 10, sorting = [], search = "") => {
        setHistoryLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/admin/email-history`, {
                params: { page: page + 1, limit: size, search, sortField, sortOrder },
            });

            // ✅ Use paginated response properly
            setHistoryEmails(res.data.data);
            setHistoryCount(res.data.totalCount);
        } catch (err) {
            setHistoryError("Failed to fetch history data");
        } finally {
            setHistoryLoading(false);
        }
    };

    const trackerColumns = [
        { accessorKey: "clientName", header: "Client Name", size: 200, minSize: 150 },
        {
            accessorKey: "email",
            header: "Email",
            size: 250,
            minSize: 200,
            cell: ({ row }) =>
                Array.isArray(row.original.email)
                    ? row.original.email.join(", ")
                    : row.original.email,
        },
        { accessorKey: "milestone", header: "Milestone (days)", size: 160 },
        {
            accessorKey: "sendDate",
            header: "Scheduled Date",
            size: 180,
            cell: ({ row }) => new Date(row.original.sendDate).toLocaleDateString(),
        },
        {
            accessorKey: "blocked",
            header: "Blocked",
            size: 120,
            cell: ({ row }) =>
                row.original.blocked ? (
                    <span className="badge bg-danger">Blocked</span>
                ) : (
                    <span className="badge bg-success">Allowed</span>
                ),
        },
    ];

    const historyColumns = [
        ...trackerColumns,
        {
            accessorKey: "status",
            header: "Status",
            size: 120,
            cell: ({ row }) => (
                <span
                    className={
                        row.original.status === "Sent" ? "badge bg-success" : "badge bg-danger"
                    }
                >
                    {row.original.status}
                </span>
            ),
        },
        {
            accessorKey: "sentAt",
            header: "Sent At",
            size: 180,
            cell: ({ row }) => new Date(row.original.sentAt).toLocaleString(),
        },
    ];

    return (
        <div className="container-fluid">

            {/* Page Header */}
            <div className="mb-5 text-center">
                <h3 className="fw-bold mb-2">📧 Milestone Email Tracker</h3>
                <p className="text-muted">
                    Monitor upcoming milestone emails and review the full history of sent messages.
                </p>
            </div>


            <div className="d-flex justify-content-end mb-4">
                <div
                    className="d-flex bg- rounded-pill border border-3"
                    style={{
                        overflow: "hidden",
                        backgroundColor: "#fff",
                    }}
                >
                    <button
                        className={` d-flex align-items-center justify-content-center ${styles.btnBase} ${activeTab === "upcoming" ? styles.activeToggle : styles.inactiveToggle
                            }`}
                        onClick={() => setActiveTab("upcoming")}

                    >
                        <FaListUl size={18} />
                    </button>

                    <button
                        className={`d-flex align-items-center justify-content-center ${styles.btnBase} ${activeTab === "history" ? styles.activeToggle : styles.inactiveToggle
                            }`}
                        onClick={() => setActiveTab("history")}
                    >
                        <FaTh size={18} />
                    </button>
                </div>
            </div>



            {/* Table Container */}
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                    {activeTab === "upcoming" ? (
                        <>
                            <h5 className="fw-bold mb-1">⏳ Emails to be Sent Tomorrow</h5>
                            <p className="text-muted small mb-4">
                                Preview milestone emails that are scheduled for the next day.
                            </p>
                            {isLoading ? (
                                <p className="text-center">Loading...</p>
                            ) : error ? (
                                <p className="text-danger text-center">{error}</p>
                            ) : (
                                <div className={styles.emailTrackerPageTableWrapper}>
                                    <div className="table-responsive border border-1 rounded-3 border-secondary-subtle px-3 bg-light-subtle">
                                        <TableComponent
                                            data={emails}
                                            columns={trackerColumns}
                                            pageSize={pageSize}
                                            pageIndex={pageIndex}
                                            setPageIndex={setPageIndex}
                                            setPageSize={setPageSize}
                                            totalCount={totalCount}
                                            sorting={sorting}
                                            setSorting={setSorting}
                                            className={`${styles["custom-style-table"]}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h5 className="fw-bold mb-1">📜 Historic Milestone Emails</h5>
                            <p className="text-muted small mb-4">
                                A record of all milestone emails that have been sent or failed.
                            </p>
                            {historyLoading ? (
                                <p className="text-center">Loading...</p>
                            ) : historyError ? (
                                <p className="text-danger text-center">{historyError}</p>
                            ) : (
                                <div className={styles.emailTrackerPageTableWrapper}>
                                    <div className="table-responsive border border-1 rounded-3 border-secondary-subtle px-3 bg-light-subtle">
                                        <TableComponent
                                            data={historyEmails}
                                            columns={historyColumns}
                                            pageSize={historyPageSize}
                                            pageIndex={historyPageIndex}
                                            setPageIndex={setHistoryPageIndex}
                                            setPageSize={setHistoryPageSize}
                                            totalCount={historyCount}
                                            sorting={historySorting}
                                            setSorting={setHistorySorting}
                                            className={`${styles["custom-style-table"]}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MilestoneTracker;
