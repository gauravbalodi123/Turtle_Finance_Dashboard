import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoFilter } from 'react-icons/io5';
import Lottie from 'lottie-react';
import parrot from '../../../assets/animation/parrot.json';
import styles from '../../../styles/AdminLayout/Prospects/AllProspects.module.css'
import TableComponent from '../../../components/SmallerComponents/TableComponent';
import SearchFilter from '../../../components/SmallerComponents/SearchFilter';
import DeleteModal from '../../../components/SmallerComponents/DeleteModal';


const AllProspects = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [prospects, setProspects] = useState([]);
    const [filteredProspects, setFilteredProspects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [targetId, setTargetId] = useState(null);
    const [selectedProspectId, setSelectedProspectId] = useState(null);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        fetchProspects(pageIndex, pageSize);
    }, [pageIndex, pageSize]);

    const fetchProspects = async (page = 0, size = 10) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${url}/admin/prospects?page=${page + 1}&limit=${size}`);
            setProspects(res.data.prospects);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch prospects.");
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = (prospectId) => {
        setSelectedProspectId(prospectId);
    };

    const handleProspectUpdate = (updatedProspect) => {
        setProspects((prev) =>
            prev.map((p) => (p._id === updatedProspect._id ? updatedProspect : p))
        );

        setFilteredProspects((prev) =>
            prev.map((p) => (p._id === updatedProspect._id ? updatedProspect : p))
        );
    };

    const handleDelete = async () => {
        if (!targetId) return;
        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/admin/prospects/${targetId}`);
            setProspects((curr) => curr.filter((p) => p._id !== targetId));
        } catch (err) {
            console.error(err);
            alert("Error deleting the prospect");
        } finally {
            setLoadingId(null);
            setTargetId(null);
        }
    };

    useEffect(() => {
        if (!columnFilter) {
            setFilteredProspects(prospects);
            return;
        }

        const lower = columnFilter.toLowerCase();

        const filtered = prospects.filter((prospect) =>
            Object.values(prospect).some(
                (val) => val && val.toString().toLowerCase().includes(lower)
            )
        );

        setFilteredProspects(filtered);
    }, [columnFilter, prospects]);

    const columns = [
        {
            accessorKey: "prospectName",
            header: "Name",
            size: 150,
            minSize: 120,
        },
        {
            accessorKey: "prospectEmail",
            header: "Email",
            size: 200,
            minSize: 160,
        },
        {
            accessorKey: "countryCode",
            header: "Country Code",
            size: 160,
            minSize: 130,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            size: 160,
            minSize: 130,
        },
        {
            accessorKey: "bookingDate",
            header: "Booking Date",
            size: 180,
            minSize: 150,
            cell: ({ row }) =>
                row.original.bookingDate
                    ? new Date(row.original.bookingDate).toLocaleString()
                    : "N/A",
        },
        {
            accessorKey: "_id", 
            header: "Action",
            enableResizing: false,
            size: 140,
            minSize: 100,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    {/* Uncomment below if you need Edit */}
                    {/* <button
          type="button"
          className="btn p-2 btn-outline-turtle-secondary"
          data-bs-toggle="modal"
          data-bs-target="#editProspectModal"
          onClick={() => openEditModal(row.original._id)}
        >
          <FaRegEdit className="d-block fs-6" />
        </button> */}
                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteProspectModal"
                        onClick={() => setTargetId(row.original._id)}
                    >
                        {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
                    </button>
                </div>
            ),
        },
    ];



    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h4 className="fw-bold mb-1">Prospects</h4>
                    <p>View and manage all your prospects</p>
                </div>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>
                    <div className={styles.prospectsTableWrapper}>
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
                                data={filteredProspects}
                                columns={columns}
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
                                setPageSize={setPageSize}
                                totalCount={totalCount}
                                className={`${styles["custom-style-table"]}`}
                            />

                            {/* <EditProspectModal
                                id={selectedProspectId}
                                url={url}
                                onSuccess={handleProspectUpdate}
                            /> */}

                            <DeleteModal
                                modalId="deleteProspectModal"
                                headerText="Confirm Deletion"
                                bodyContent="Are you sure you want to delete this prospect?"
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

export default AllProspects;