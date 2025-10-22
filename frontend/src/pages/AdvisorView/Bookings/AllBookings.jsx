import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import styles from '../../../styles/AdvisorLayout/Booking/AllBookings.module.css';
import { IoFilter } from 'react-icons/io5';
import Lottie from 'lottie-react';
import parrot from '../../../assets/animation/parrot.json';
import SearchFilter from '../../../components/SmallerComponents/SearchFilter';
import TableComponent from '../../../components/SmallerComponents/TableComponent';
import DeleteModal from '../../../components/SmallerComponents/DeleteModal';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditBookingsModal from './EditBookingsModal'; // ✅ Advisor version
import { FaGoogle } from "react-icons/fa";

const AllBookings = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [targetId, setTargetId] = useState(null);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [showEditBookingModal, setShowEditBookingModal] = useState(false);

    const [sorting, setSorting] = useState([]);

    const [bookingStats, setBookingStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0,
        issues: 0,
    });

    const openEditModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowEditBookingModal(true);
    };

    const closeEditModal = () => {
        setShowEditBookingModal(false);
        setSelectedBookingId(null);
    };

    useEffect(() => {
        fetchBookings(pageIndex, pageSize, sorting, columnFilter);
    }, [pageIndex, pageSize, sorting, columnFilter]);

    const fetchBookings = async (
        page = 0,
        size = 10,
        sorting = [],
        search = ""
    ) => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/advisor/selectiveBookings`, {
                params: {
                    page: page + 1,
                    limit: size,
                    sortField,
                    sortOrder,
                    search
                }
            });

            setBookings(res.data.bookings);
            setFilteredBookings(res.data.bookings);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
            setError("Failed to fetch bookings");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${url}/advisor/bookings/stats`);
            setBookingStats(res.data);
        } catch (err) {
            console.error("Stats error:", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleBookingUpdate = (updatedBooking) => {
        setBookings(prev =>
            prev.map(b => b._id === updatedBooking._id ? updatedBooking : b)
        );

        setFilteredBookings(prev =>
            prev.map(b => b._id === updatedBooking._id ? updatedBooking : b)
        );

        fetchStats();
    };

    const handleDelete = async () => {
        if (!targetId) return;
        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/advisor/bookings/${targetId}`);
            setBookings((curr) => curr.filter((b) => b._id !== targetId));
            fetchStats();
        } catch (err) {
            console.error(err);
            alert("Error deleting the booking");
        } finally {
            setLoadingId(null);
            setTargetId(null);
        }
    };

    const columns = [
        { accessorKey: "name", header: "Event Name", size: 150, sortDescFirst: true },
        { accessorKey: "status", header: "Status", size: 100, sortDescFirst: true },
        { accessorKey: "simplifiedStatus", header: "Simplified Status", size: 180, sortDescFirst: true },
        { accessorKey: "inviteeFullName", header: "Client Name", size: 150, sortDescFirst: true },
        { accessorKey: "inviteeEmail", header: "Client Email", size: 200, sortDescFirst: true },
        { accessorKey: "cancellation.canceled_by", header: "Canceled By", size: 160 },
        { accessorKey: "cancellation.reason", header: "Cancellation Reason", size: 200 },
        {
            accessorKey: "is_completed",
            header: "Completed?",
            size: 130,
            sortDescFirst: true,
            cell: ({ row }) => {
                const value = row.original.is_completed;
                return value === "yes" ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>Yes</span>
                ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>No</span>
                );
            },
        },
        {
            accessorKey: "event_guests",
            header: "Event Guests",
            size: 135,
            sortDescFirst: true,
            cell: ({ row }) => {
                const guests = row.original.event_guests || [];
                return guests.length ? guests.map(g => g.email).filter(Boolean).join(", ") : "N/A";
            },
        },
        {
            accessorKey: "advisors",
            header: "Advisor Email(s)",
            size: 180,
            sortDescFirst: true,
            cell: ({ row }) => {
                const advisors = row.original.advisors || [];
                return advisors.length
                    ? advisors.map(a => a.email).filter(Boolean).join(", ")
                    : "N/A";
            },
        },
        {
            accessorKey: "countryCode",
            id: "countryCode",
            header: "Country Code",
            size: 140,
            sortDescFirst: true,
            cell: ({ row }) => {
                const qa = row.original.invitee?.questionsAndAnswers || [];
                const phoneQA = qa.find(q => q.question === "Phone Number");
                return phoneQA?.countryCode || "N/A";
            },
        },
        {
            accessorKey: "phoneNumber",
            id: "phoneNumber",
            header: "Phone Number",
            size: 150,
            sortDescFirst: true,
            cell: ({ row }) => {
                const qa = row.original.invitee?.questionsAndAnswers || [];
                const phoneQA = qa.find(q => q.question === "Phone Number");
                return phoneQA?.phoneNumber || "N/A";
            },
        },
        {
            accessorKey: "_id",
            header: "Action",
            size: 100,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="d-flex gap-2">

                    {/* 
            <button
                type="button"
                className="btn p-2 btn-outline-turtle-secondary"
                onClick={() => openEditModal(row.original._id)}
            >
                <FaRegEdit className="d-block fs-6" />
            </button>

            <button
                type="button"
                className="btn p-2 btn-outline-turtle-secondary"
                data-bs-toggle="modal"
                data-bs-target="#deleteBookingModal"
                onClick={() => setTargetId(row.original._id)}
            >
                {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
            </button>
            */}

                    {row.original.location?.join_url && (
                        <a
                            href={row.original.location.join_url}
                            className="btn p-2 btn-outline-turtle-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGoogle className="d-block fs-6" />
                        </a>
                    )}
                </div>
            ),
        }

    ];

    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
                <div className="mb-3">
                    <h4 className={`${styles.taskHeaderItem} fw-bold mb-1`}>Bookings</h4>
                    <p className={`${styles.taskHeaderItem}`}>View and manage your scheduled bookings.</p>
                </div>
            </div>

            <div className="mb-4 row gx-3 gy-3 gy-lg-0">
                <div className="col-12 col-md-3">
                    <div className={`card p-4 ${styles}`}>
                        <h4 className="fs-5 fw-bold">Total Bookings</h4>
                        <p className="fs-6 mb-2 text-secondary">All recorded bookings</p>
                        <h2 className="fs-4 fw-bolder">{bookingStats.total}</h2>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className={`card p-4 ${styles}`}>
                        <h4 className="fs-5 fw-bold">Upcoming</h4>
                        <p className="fs-6 mb-2 text-secondary">Future meetings</p>
                        <h2 className="fs-4 fw-bolder">{bookingStats.upcoming}</h2>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className={`card p-4 ${styles}`}>
                        <h4 className="fs-5 fw-bold">Completed</h4>
                        <p className="fs-6 mb-2 text-secondary">Successfully held meetings</p>
                        <h2 className="fs-4 fw-bolder">{bookingStats.completed}</h2>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className={`card p-4 ${styles}`}>
                        <h4 className="fs-5 fw-bold">Issues</h4>
                        <p className="fs-6 mb-2 text-secondary">Canceled, no-shows, rescheduled</p>
                        <h2 className="fs-4 fw-bolder">{bookingStats.issues}</h2>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>
                    <div className={styles.bookingsPageTableWrapper}>
                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle px-3 bg-light-subtle">
                            <div className="my-3 d-flex justify-content-between">
                                <SearchFilter
                                    columnFilter={columnFilter}
                                    setColumnFilter={setColumnFilter}
                                />
                                <button className="btn btn-outline-turtle-secondary d-flex align-items-center">
                                    <IoFilter className="me-2" />
                                    Filter
                                </button>
                            </div>

                            <TableComponent
                                data={filteredBookings}
                                columns={columns}
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

                            <EditBookingsModal
                                show={showEditBookingModal}
                                onHide={closeEditModal}
                                id={selectedBookingId}
                                url={url}
                                onSuccess={(updated) => {
                                    handleBookingUpdate(updated);
                                    closeEditModal();
                                }}
                            />

                            <DeleteModal
                                modalId="deleteBookingModal"
                                headerText="Confirm Deletion"
                                bodyContent="Are you sure you want to delete this booking?"
                                confirmButtonText="Delete"
                                onConfirm={() => handleDelete(targetId)}
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default AllBookings;
