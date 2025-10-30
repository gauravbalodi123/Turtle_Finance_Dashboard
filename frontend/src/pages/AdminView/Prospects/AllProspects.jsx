import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Link } from "react-router-dom";
import { IoFilter } from 'react-icons/io5';
import Lottie from 'lottie-react';
import parrot from '../../../assets/animation/parrot.json';
import styles from "../../../styles/AdminLayout/Prospects/AllProspects.module.css";
import TableComponent from '../../../components/SmallerComponents/TableComponent';
import SearchFilter from '../../../components/SmallerComponents/SearchFilter';
import DeleteModal from '../../../components/SmallerComponents/DeleteModal';
import { FaRegEye, FaRegEdit } from "react-icons/fa";


const AllProspects = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [prospects, setProspects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [targetId, setTargetId] = useState(null);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [sorting, setSorting] = useState([]);
    const [columnFilter, setColumnFilter] = useState("");

    useEffect(() => {
        fetchProspects(pageIndex, pageSize, sorting, columnFilter);
    }, [pageIndex, pageSize, sorting, columnFilter]);


    const fetchProspects = async (page = 0, size = 10, sorting = [], search = "") => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/admin/selectiveProspects`, {
                params: {
                    page: page + 1,
                    limit: size,
                    sortField,
                    sortOrder,
                    search,
                },
            });

            setProspects(res.data.clients);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch prospects.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!targetId) return;
        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/admin/clients/${targetId}`); // 🔥 delete API is same
            setProspects((curr) => curr.filter((p) => p._id !== targetId));
        } catch (err) {
            console.error(err);
            alert('Error deleting the prospect');
        } finally {
            setLoadingId(null);
            setTargetId(null);
        }
    };



    const columns = [
        {
            accessorKey: "fullName",
            header: "Full Name",
            enableResizing: true,
            size: 170,
            minSize: 150,
            sortDescFirst: true,
            cell: ({ row }) => (
                <Link
                    role="button"
                    className="text-dark p-0 text-decoration-none"
                    data-bs-toggle="modal"
                    data-bs-target="#clientDetailModal"
                    onClick={() => setSelectedClientId(row.original._id)} // 👈 Save clicked client's ID
                >
                    {row.original.fullName}
                </Link>
            ),

        },
        // { accessorKey: "salutation", header: "Salutation", enableResizing: true, size: 120, minSize: 80 },
        // { accessorKey: "leadSourceId", header: "Lead Source ID", enableResizing: true, size: 150, minSize: 120 },
        // { accessorKey: "leadSource", header: "Lead Source", enableResizing: true, size: 130, minSize: 140 },
        // { accessorKey: "clientType", header: "Client Type", enableResizing: true, size: 130, minSize: 140 },


        // {
        //     accessorKey: "advisors",
        //     header: "Advisors",
        //     enableResizing: true,
        //     size: 200,
        //     minSize: 200,
        //     cell: ({ row }) => {
        //         const advisors = row.original.advisors;

        //         if (!advisors || advisors.length === 0) return "N/A";

        //         return (
        //             <ul className="list-unstyled mb-0">
        //                 {advisors.map((advisor, idx) => (
        //                     <li key={idx}>
        //                         <span className="fw-medium">{advisor.advisorFullName}</span>{" "}
        //                         <small className="text-muted">({advisor.email})</small>
        //                     </li>
        //                 ))}
        //             </ul>
        //         );
        //     }
        // },
        {
            accessorKey: "subscriptionStatus",
            header: "Subscription Status",
            enableResizing: true,
            size: 170,
            minSize: 100,
            sortDescFirst: true,
            cell: ({ getValue }) => {
                const value = getValue();
                let statusClass = "";

                if (value === "Active") statusClass = styles["active-status"];
                else if (value === "Expired") statusClass = styles["expired-status"];
                else if (value === "Up for Renewal") statusClass = styles["renewal-status"];
                else if (value === "Prospect") statusClass = styles["Prospect-status"];

                return <span className={statusClass}>{value}</span>;
            }
        },
        // { accessorKey: "gender", header: "Gender", enableResizing: true, size: 100, minSize: 80 },
        { accessorKey: "countryCode", header: "Country Code", enableResizing: true, size: 135, sortDescFirst: true, minSize: 100 },
        { accessorKey: "phone", header: "Phone", enableResizing: true, size: 110, minSize: 100, sortDescFirst: true, },

        { accessorKey: "countryCode2", header: "Country Code 2", enableResizing: true, size: 145, minSize: 110, sortDescFirst: true, },
        { accessorKey: "phone2", header: "Phone 2", enableResizing: true, size: 130, minSize: 110, sortDescFirst: true, },
        {
            accessorKey: "email",
            header: "Email(s)",
            enableResizing: true,
            size: 220,
            minSize: 180,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.email && row.original.email.length
                    ? row.original.email.join(", ")
                    : "N/A",
        },
        // { accessorKey: "address", header: "Address", enableResizing: true, size: 180, minSize: 150 },
        {
            accessorKey: "subscriptionDate",
            header: "Subscription Date",
            enableResizing: true,
            size: 160,
            minSize: 140,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.subscriptionDate
                    ? new Date(row.original.subscriptionDate).toLocaleDateString("en-GB")
                    : "N/A",
        },

        // {
        //     accessorKey: "subscriptionDue",
        //     header: "Subscription Due",
        //     enableResizing: true,
        //     size: 160,
        //     minSize: 140,
        //     cell: ({ row }) =>
        //         row.original.subscriptionDue
        //             ? new Date(row.original.subscriptionDue).toLocaleDateString("en-GB")
        //             : "N/A",
        // },

        // {
        //     accessorKey: "riskProfileDate",
        //     header: "Risk Profile Date",
        //     enableResizing: true,
        //     size: 160,
        //     minSize: 140,
        //     cell: ({ row }) =>
        //         row.original.riskProfileDate
        //             ? new Date(row.original.riskProfileDate).toLocaleDateString("en-GB")
        //             : "N/A",
        // },

        // {
        //     accessorKey: "kickOffDate",
        //     header: "Kick Off Date",
        //     enableResizing: true,
        //     size: 140,
        //     minSize: 140,
        //     cell: ({ row }) =>
        //         row.original.kickOffDate
        //             ? new Date(row.original.kickOffDate).toLocaleDateString("en-GB")
        //             : "N/A",
        // },

        // {
        //     accessorKey: "onboardingStatus",
        //     header: "Onboarding Status",
        //     enableResizing: true,
        //     size: 170,
        //     minSize: 100,
        //     cell: ({ getValue }) => {
        //         const status = getValue();
        //         let className = "";

        //         if (status === "Not Started") className = styles["not-started"];
        //         else if (status === "RIA Allocated") className = styles["ria-allocated"];
        //         else if (status === "Payment Received") className = styles["payment-received"];
        //         else if (status === "Risk Profile Done") className = styles["risk-profile"];
        //         else if (status === "Kick Off Done") className = styles["kick-off"];
        //         else if (status === "Contract Signed") className = styles["contract-signed"];

        //         return <span className={className}>{status}</span>;
        //     }
        // },

        // {
        //     accessorKey: "dob",
        //     header: "Date of Birth",
        //     enableResizing: true,
        //     size: 140,
        //     minSize: 140,
        //     cell: ({ row }) =>
        //         row.original.dob ? new Date(row.original.dob).toLocaleDateString("en-GB") : "N/A",
        // },

        // { accessorKey: "companyName", header: "Company Name", enableResizing: true, size: 150, minSize: 150 },

        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 135,
            minSize: 130,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <Link
                        to={`/adminautharized/admin/clients/${row.original._id}/editClients`}
                        className="btn p-2 btn-outline-turtle-secondary"
                    >
                        <FaRegEdit className="d-block fs-6" />
                    </Link>

                    <Link
                        to={`/adminautharized/admin/clients/${row.original._id}/riskProfile`}
                        className="btn p-2 btn-outline-turtle-secondary"
                    >
                        <FaRegEye className="d-block fs-6" title="View Risk Profile" />
                    </Link>


                    {/* <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => setTargetId(row.original._id)}
                        disabled={loadingId === row.original._id}
                    >
                        {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
                    </button> */}
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

                <Link to="addProspects">
                    <button className="btn btn-custom-turtle-background">Create New Prospect</button>
                </Link>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>
                    <div className={styles.prospectsTableWrapper}>
                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle px-3 bg-light-subtle">
                            <div className="my-3 bg-light-subtle d-flex justify-content-between">
                                <div>
                                    <SearchFilter
                                        columnFilter={columnFilter}
                                        setColumnFilter={setColumnFilter}
                                    />
                                </div>
                                <div>
                                    <button className="d-flex align-items-center btn btn-outline-turtle-secondary">
                                        <IoFilter className="me-2" />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <TableComponent
                                data={prospects}
                                columns={columns}
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
                                setPageSize={setPageSize}
                                totalCount={totalCount}
                                sorting={sorting}
                                setSorting={setSorting}
                                className={`${styles['custom-style-table']}`}
                            />

                            <DeleteModal
                                modalId="deleteModal"
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
