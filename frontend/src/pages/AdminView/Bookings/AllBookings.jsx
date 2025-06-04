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
import EditBookingsModal from './EditBookingsModal';
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

  const [bookingStats, setBookingStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    issues: 0,
  });

  useEffect(() => {
    fetchBookings(pageIndex, pageSize);
  }, [pageIndex, pageSize]);


  const fetchBookings = async (page = 0, size = 10) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${url}/admin/bookings?page=${page + 1}&limit=${size}`);
      setBookings(res.data.bookings);
      // setTotalCount(res.data.total);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch bookings.");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchStats = async () => {
    try {
      const res = await axios.get(`${url}/admin/bookings/stats`);
      setBookingStats(res.data);
      setTotalCount(res.data.total);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);


  const openEditModal = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

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
      await axios.delete(`${url}/admin/bookings/${targetId}`);
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

  useEffect(() => {
    if (!columnFilter) {
      setFilteredBookings(bookings);
      return;
    }

    const lower = columnFilter.toLowerCase();

    const filtered = bookings.filter((booking) =>
      Object.values(booking).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(lower)
      )
    );

    setFilteredBookings(filtered);
  }, [columnFilter, bookings]);

  const columns = [
    // { accessorKey: "bookingId", header: "Booking ID", size: 200 },
    // { accessorKey: "event_type", header: "Event Type", size: 150 },
    // {
    //   accessorKey: "start_time",
    //   header: "Start Time",
    //   size: 180,
    //   cell: ({ row }) =>
    //     row.original.start_time
    //       ? new Date(row.original.start_time).toLocaleString("en-GB", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "numeric",
    //         hour: "numeric",
    //         minute: "numeric",
    //         hour12: true
    //       })
    //       : "N/A",
    // },
    // {
    //   accessorKey: "end_time",
    //   header: "End Time",
    //   size: 180,
    //   cell: ({ row }) =>
    //     row.original.end_time
    //       ? new Date(row.original.end_time).toLocaleString("en-GB", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "numeric",
    //         hour: "numeric",
    //         minute: "numeric",
    //         hour12: true
    //       })
    //       : "N/A",
    // },



    // { accessorKey: "uri", header: "URI", size: 250 },

    // Invitee Info
    // { accessorKey: "invitee.firstName", header: "Invitee First Name", size: 160 },
    // { accessorKey: "invitee.lastName", header: "Invitee Last Name", size: 160 },

    // Calendar Event Info
    // { accessorKey: "calendar_event.external_id", header: "Calendar External ID", size: 220 },
    // { accessorKey: "calendar_event.kind", header: "Calendar Kind", size: 160 },

    // Cancellation Info
    // { accessorKey: "cancellation.canceler_type", header: "Canceler Type", size: 160 },
    // { accessorKey: "cancellation.created_at", header: "Cancelled At", size: 180 },

    // Location Info
    // { accessorKey: "location.status", header: "Location Status", size: 160 },
    // { accessorKey: "location.type", header: "Location Type", size: 160 },

    // Timeline
    // { accessorKey: "created_at_timeline", header: "Created At (Timeline)", size: 180 },
    // { accessorKey: "updated_at_timeline", header: "Updated At (Timeline)", size: 180 },

    // Meeting Notes
    // { accessorKey: "meeting_notes_plain", header: "Meeting Notes", size: 300 },

    //{
    //   header: "Host Name",
    //   accessorKey: "event_memberships",
    //   size: 180,
    //   cell: ({ row }) => {
    //     const host = row.original.event_memberships?.[0];
    //     return host?.user_name || "—";
    //   }
    // },
    // {
    //   header: "Host Email",
    //   accessorKey: "event_memberships",
    //   size: 200,
    //   cell: ({ row }) => {
    //     const host = row.original.event_memberships?.[0];
    //     return host?.user_email || "—";
    //   }
    // }

    // Event Guests (just showing first guest for simplicity)

    { accessorKey: "name", header: "Name", size: 150 },
    { accessorKey: "status", header: "Status", size: 100 },
    { accessorKey: "invitee.fullName", header: "Client Name", size: 180 },
    { accessorKey: "invitee.email", header: "Client Email", size: 200 },
    { accessorKey: "cancellation.canceled_by", header: "Canceled By", size: 160 },
    { accessorKey: "cancellation.reason", header: "Cancellation Reason", size: 200 },
    { accessorKey: "location.join_url", header: "Join URL", size: 250 },

    {
      accessorKey: "event_guests",
      header: "Advisor Email",
      enableResizing: true,
      size: 200,
      // minSize: 180,
      cell: ({ row }) => {
        const guest = row.original.event_guests?.[0];
        return guest?.email || "N/A";
      }
    },
    {
      header: "Phone Number",
      accessorKey: "invitee.questionsAndAnswers",
      size: 160,
      cell: ({ row }) => {
        const qa = row.original.invitee?.questionsAndAnswers || [];
        const phoneQA = qa.find(q => q.question === "Phone Number");
        return phoneQA?.phoneNumber || "N/A";
      }
    },
    {
      header: "Country Code",
      accessorKey: "invitee.questionsAndAnswers",
      size: 120,
      cell: ({ row }) => {
        const qa = row.original.invitee?.questionsAndAnswers || [];
        const phoneQA = qa.find(q => q.question === "Phone Number");
        return phoneQA?.countryCode || "N/A";
      }
    },
    {
      header: "Client Query",
      accessorKey: "invitee.questionsAndAnswers",
      size: 220,
      cell: ({ row }) => {
        const qa = row.original.invitee?.questionsAndAnswers || [];
        const queryQA = qa.find(q => q.question.includes("queries"));
        return queryQA?.answer || "N/A";
      }
    },
    {
      accessorKey: "_id",
      header: "Action",
      enableResizing: false,
      size: 140,
      minSize: 100,
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

          {row.original.location?.join_url && (
            <a
              href={row.original.location.join_url}
              className="btn p-2 btn-outline-turtle-secondary"
            >
              <FaGoogle className="d-block fs-6" />
            </a>
          )}
        </div>
      )

    }


  ];


  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between">
        <div className="mb-3">
          <h4 className={`${styles.taskHeaderItem} fw-bold mb-1`}>Bookings</h4>
          <p className={`${styles.taskHeaderItem}`}>View and manage all scheduled bookings.</p>
        </div>
      </div>

      <div className="mb-4 row gx-3 gy-3 gy-lg-0">
        {/* Total Bookings */}
        <div className="col-12 col-md-3">
          <div className={`card p-4 ${styles}`}>
            <h4 className="fs-5 fw-bold">Total Bookings</h4>
            <p className="fs-6 mb-2 text-secondary">All recorded bookings</p>
            <h2 className="fs-4 fw-bolder">{bookingStats.total}</h2>
          </div>
        </div>

        {/* Upcoming */}
        <div className="col-12 col-md-3">
          <div className={`card p-4 ${styles}`}>
            <h4 className="fs-5 fw-bold">Upcoming</h4>
            <p className="fs-6 mb-2 text-secondary">Future meetings</p>
            <h2 className="fs-4 fw-bolder">{bookingStats.upcoming}</h2>
          </div>
        </div>

        {/* Completed */}
        <div className="col-12 col-md-3">
          <div className={`card p-4 ${styles}`}>
            <h4 className="fs-5 fw-bold">Completed</h4>
            <p className="fs-6 mb-2 text-secondary">Successfully held meetings</p>
            <h2 className="fs-4 fw-bolder">{bookingStats.completed}</h2>
          </div>
        </div>

        {/* Issues */}
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
                className={`${styles["custom-style-table"]}`}
              />

              {/* <EditTaskModal
                id={selectedTaskId}
                url={url}
                clients={clients}
                advisors={advisors}
                onSuccess={handleTaskUpdate}
              /> */}

              <EditBookingsModal
                id={selectedBookingId}
                url={url}
                onSuccess={handleBookingUpdate}
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
