import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parrot from "../../../assets/animation/parrot.json";
import TableComponent from "../../../components/SmallerComponents/TableComponent";
// import styles from "../../../styles/AdminLayout/Clients/AllClients.module.css";
import styles from '@styles/AdminLayout/Clients/AllClients.module.css'
import SearchFilter from "../../../components/SmallerComponents/SearchFilter";
import { IoFilter } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteModal from "../../../components/SmallerComponents/DeleteModal";
import ClientDetailedInfoModal from "../../../components/SmallerComponents/ClientDetailedInfoModal/ClientDetailedInfoModal";
import { FaRegEye, FaRegEdit } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";

const AllClients = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const [clients, setClients] = useState([]);
    // const [filteredClients, setFilteredClients] = useState([]); // ✅ New state for filtered data
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState(""); // ✅ Search filter state
    const [targetId, setTargetId] = useState(null);

    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [sorting, setSorting] = useState([]);

    const [selectedClientId, setSelectedClientId] = useState(null);

    const [statusFilter, setStatusFilter] = useState(null);










    useEffect(() => {
        fetchClients(pageIndex, pageSize, sorting, columnFilter, statusFilter);
    }, [pageIndex, pageSize, sorting, columnFilter, statusFilter]);



    const fetchClients = async (page = 0, size = 10, sorting = [], search = "", status = statusFilter) => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/admin/selectiveClients`, {
                params: {
                    page: page + 1,
                    limit: size,
                    search,
                    sortField,
                    sortOrder,
                    subscriptionStatus: status, // 👈 add this line
                },
            });
            setClients(res.data.clients);
            setTotalCount(res.data.total);
        } catch (err) {
            setError("Failed to fetch clients");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get(`${url}/admin/clients/stats`);
                setSummary(res.data); // Expects { total, active, expired }
            } catch (error) {
                console.error("Error fetching summary:", error);
            } finally {
                setLoadingSummary(false);
            }
        };

        fetchSummary();
    }, []);

    const handleDelete = async () => {
        if (!targetId) return;
        setLoadingId(targetId);

        try {
            await axios.delete(`${url}/admin/clients/${targetId}`);
            setClients((currClients) =>
                currClients.filter((client) => client._id !== targetId)
            );
        } catch (e) {
            console.error(e);
            alert("Error deleting the client");
        } finally {
            setLoadingId(null);
            setTargetId(null); // Clear after delete
        }
    };




    // ✅ Filter logic: Runs whenever columnFilter or clients change
    // useEffect(() => {
    //     if (!columnFilter) {
    //         setFilteredClients(clients); // Reset when filter is empty
    //         return;
    //     }

    //     const lowerCaseFilter = columnFilter.toLowerCase();

    //     const filteredData = clients.filter((client) =>
    //         Object.values(client).some(
    //             (value) =>
    //                 value &&
    //                 value.toString().toLowerCase().includes(lowerCaseFilter)
    //         )
    //     );

    //     setFilteredClients(filteredData);
    // }, [columnFilter, clients]);

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
                    onClick={() => setSelectedClientId(row.original._id)} // 👈 Save clicked client's ID
                >
                    {row.original.fullName}
                </Link>
            ),
        },
        // { accessorKey: "salutation", header: "Salutation", enableResizing: true, size: 120, minSize: 80 },
        // { accessorKey: "leadSourceId", header: "Lead Source ID", enableResizing: true, size: 150, minSize: 120 },
        // { accessorKey: "leadSource", header: "Lead Source", enableResizing: true, size: 130, minSize: 140 },
        { accessorKey: "clientType", header: "Client Type", enableResizing: true, size: 115, minSize: 100 },


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
                else if (value === "Prospect") statusClass = styles["prospect-status"];
                else if (value === "Deadpool") statusClass = styles["deadpool-status"];

                return <span className={statusClass}>{value}</span>;
            }
        },
        // { accessorKey: "gender", header: "Gender", enableResizing: true, size: 100, minSize: 80 },
        // { accessorKey: "countryCode", header: "Country Code", enableResizing: true, size: 135, minSize: 100 },
        // { accessorKey: "phone", header: "Phone", enableResizing: true, size: 110, minSize: 100, sortDescFirst: true, },

        // { accessorKey: "countryCode2", header: "Country Code 2", enableResizing: true, size: 145, minSize: 110 },
        // { accessorKey: "phone2", header: "Phone 2", enableResizing: true, size: 130, minSize: 110 },
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
            accessorKey: "phones",
            header: "Phone Numbers",
            enableResizing: true,
            size: 150,
            minSize: 150,
            cell: ({ row }) => {
                const { countryCode, phone, countryCode2, phone2 } = row.original;

                const phoneList = [];

                // First number
                if (countryCode || phone) {
                    phoneList.push([countryCode, phone].filter(Boolean).join(" ")); // join only existing parts
                }

                // Second number
                if (countryCode2 || phone2) {
                    phoneList.push([countryCode2, phone2].filter(Boolean).join(" "));
                }

                // Render each phone in a separate line, or "N/A" if none exist
                return phoneList.length > 0
                    ? phoneList.map((p, i) => <div key={i}>{p}</div>)
                    : "N/A";
            },
        },


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
        //     size: 130,
        //     minSize: 120,
        //     cell: ({ row }) =>
        //         row.original.dob ? new Date(row.original.dob).toLocaleDateString("en-GB") : "N/A",
        // },


        // {
        //     accessorKey: "bio",
        //     header: "Bio",
        //     enableResizing: true,
        //     size: 250,
        //     minSize: 200,
        //     cell: ({ row }) => {
        //         const bio = row.original.bio || "N/A";
        //         return bio.length > 100 ? bio.substring(0, 100) + "..." : bio;
        //     }
        // },


        // { accessorKey: "companyName", header: "Company Name", enableResizing: true, size: 150, minSize: 150 },

        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 180,
            minSize: 130,
            enableSorting: false,
            cell: ({ row }) => {
                const linkedinUrl = row.original.linkedinProfile;
                return (
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

                        <a
                            href={linkedinUrl || "#"}
                            target={linkedinUrl ? "_blank" : undefined}
                            rel={linkedinUrl ? "noopener noreferrer" : undefined}
                            className={`btn p-2 btn-outline-turtle-secondary ${!linkedinUrl ? "disabled" : ""}`}
                            title={linkedinUrl ? "View LinkedIn" : "LinkedIn Not Available"}
                            onClick={(e) => !linkedinUrl && e.preventDefault()} // prevent click if no URL
                        >
                            <BsLinkedin className="d-block fs-6" />
                        </a>
                    </div>
                );
            }
        }

    ];


    return (
        <div className="container-fluid ">
            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-between mb-3 '>
                    <div>
                        <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>Clients</h4>
                        <p className={`  ${styles.taskHeaderItem}`}>View and manage all client accounts and memberships.</p>
                    </div>
                </div>

                <Link to="addClients">
                    <button className="btn btn-custom-turtle-background">Create New Client</button>
                </Link>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>

                    <div className='mb-4 row gx-3 gy-3 gy-lg-0'>
                        {[
                            { key: null, title: "Total Clients", desc: "All registered clients", value: summary?.total },
                            { key: "Active", title: "Active Membership", desc: "Currently active clients", value: summary?.active },
                            { key: "Up for Renewal", title: "Up for Renewal", desc: "Clients nearing renewal", value: summary?.upForRenewal },
                            { key: "Expired", title: "Expired Membership", desc: "Currently expired clients", value: summary?.expired },
                            { key: "Deadpool", title: "Deadpool", desc: "Clients marked as deadpool", value: summary?.deadpool },
                        ].map((card, idx) => {
                            const isSelected = statusFilter === card.key;

                            return (
                                <div key={idx} className="col-12 col-md text-center text-md-start">
                                    <div
                                        className={`card p-4 h-100 d-flex flex-column justify-content-between ${styles.cardHover} ${isSelected ? styles.selectedCard : ""
                                            }`}
                                        onClick={() => {
                                            setStatusFilter(prev => (prev === card.key ? null : card.key));
                                        }}
                                    >
                                        <div>
                                            <h4 className="fs-5 fw-bold">{card.title}</h4>
                                            <p className="fs-6 mb-2 text-secondary">{card.desc}</p>
                                        </div>
                                        <h2 className='fs-4 m-0 fw-bolder'>
                                            {loadingSummary ? '...' : card.value}
                                        </h2>
                                    </div>
                                </div>
                            );
                        })}
                    </div>






                    <div className={styles.clientsPageTableWrapper}>

                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle  px-3 bg-light-subtle">

                            <div className="my-3 bg-light-subtle d-flex justify-content-between " >
                                <div className="">
                                    <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} setSelectedClientId={setSelectedClientId} />
                                </div>

                                <div>
                                    <button className="d-flex align-items-center justify-content-between text-align-center btn btn-outline-turtle-secondary ">
                                        <IoFilter className="text-align-center me-2" />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <TableComponent
                                data={clients}
                                columns={columns}
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
                                setPageSize={setPageSize}
                                totalCount={totalCount}
                                sorting={sorting}
                                setSorting={setSorting}
                                className={`${styles["custom-style-table"]}`}
                            />


                            <DeleteModal
                                modalId="deleteModal"
                                headerText="Confirm Deletion"
                                bodyContent="Are you sure you want to delete this client?"
                                confirmButtonText="Delete"
                                onConfirm={() => handleDelete(targetId)}
                            />




                            <ClientDetailedInfoModal
                                clientId={selectedClientId}
                                onClose={() => setSelectedClientId(null)}
                            />


                        </div>

                    </div>

                </Fragment>
            )}
        </div>
    );
};

export default AllClients;
