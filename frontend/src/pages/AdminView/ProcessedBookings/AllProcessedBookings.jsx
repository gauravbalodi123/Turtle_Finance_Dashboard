import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import styles from '../../../styles/AdminLayout/Booking/AllBookings.module.css';
import { IoFilter } from 'react-icons/io5';
import Lottie from 'lottie-react';
import parrot from '../../../assets/animation/parrot.json';
import SearchFilter from '../../../components/SmallerComponents/SearchFilter';
import TableComponent from '../../../components/SmallerComponents/TableComponent';
import DeleteModal from '../../../components/SmallerComponents/DeleteModal';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// import { FaGoogle } from "react-icons/fa";

const AllProcessedBookings = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [processedBookings, setProcessedBookings] = useState([]);
    // const [filteredBookings, setFilteredBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [targetId, setTargetId] = useState(null);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        fetchProcessedBookings(pageIndex, pageSize, sorting, columnFilter);
    }, [pageIndex, pageSize, sorting, columnFilter]);

    const fetchProcessedBookings = async (page = 0, size = 10, sorting = [], search = "") => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/admin/selectiveProcessedBookings`, {
                params: {
                    page: page + 1,
                    limit: size,
                    sortField,
                    sortOrder,
                    search
                }
            });

            setProcessedBookings(res.data.processedBookings);
            // setFilteredBookings(res.data.processedBookings);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error("Failed to fetch processed bookings", err);
            setError("Failed to fetch processed bookings");
        } finally {
            setIsLoading(false);
        }
    };

    // const openEditModal = (bookingId) => {
    //     setSelectedBookingId(bookingId);
    // };

    const handleDelete = async () => {
        if (!targetId) return;
        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/admin/processedBookings/${targetId}`);
            setProcessedBookings((curr) => curr.filter((b) => b._id !== targetId));
        } catch (err) {
            console.error(err);
            alert("Error deleting the processed booking");
        } finally {
            setLoadingId(null);
            setTargetId(null);
        }
    };

    const columns = [
        { accessorKey: "event_id", header: "Event ID", size: 140 },

        {
            accessorKey: "name",
            header: "Name",
            size: 160,
            cell: ({ row }) => row.original.name || "N/A",
        },

        {
            accessorKey: "invitee.fullName",
            header: "Client Name",
            size: 180,
            cell: ({ row }) => row.original.invitee?.fullName || "N/A",
        },

        {
            accessorKey: "invitee.email",
            header: "Client Email",
            size: 200,
            cell: ({ row }) => row.original.invitee?.email || "N/A",
        },

        {
            accessorKey: "advisors",
            header: "Advisors",
            size: 200,
            cell: ({ row }) =>
                row.original.advisors?.length
                    ? row.original.advisors.join(", ")
                    : "N/A",
        },

        {
            accessorKey: "start_time",
            header: "Start Time",
            size: 150,
            cell: ({ row }) =>
                row.original.start_time
                    ? new Date(row.original.start_time).toLocaleString("en-GB")
                    : "N/A",
        },

        {
            accessorKey: "end_time",
            header: "End Time",
            size: 150,
            cell: ({ row }) =>
                row.original.end_time
                    ? new Date(row.original.end_time).toLocaleString("en-GB")
                    : "N/A",
        },

        { accessorKey: "status", header: "Status", size: 120 },
        { accessorKey: "is_latest", header: "Latest?", size: 100 },
        { accessorKey: "is_completed", header: "Completed?", size: 120 },
        { accessorKey: "occurrence", header: "Occurrence", size: 120 },

        {
            accessorKey: "_id",
            header: "Action",
            size: 140,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#editBookingsModal"
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
                </div>
            )
        }
    ];


    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
                <div className="mb-3">
                    <h4 className={`${styles.taskHeaderItem} fw-bold mb-1`}> Processed Bookings</h4>
                    <p className={`${styles.taskHeaderItem}`}>View and manage all scheduled/upcoming bookings.</p>
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
                            {/* <div className="my-3 d-flex justify-content-between">
                                <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                                <button className="btn btn-outline-turtle-secondary d-flex align-items-center">
                                    <IoFilter className="me-2" />
                                    Filter
                                </button>
                            </div> */}

                            <TableComponent
                                data={processedBookings}
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



                            <DeleteModal
                                modalId="deleteBookingModal"
                                headerText="Confirm Deletion"
                                bodyContent="Are you sure you want to delete this processed booking?"
                                confirmButtonText="Delete"
                                onConfirm={handleDelete}
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default AllProcessedBookings;
