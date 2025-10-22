import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parrot from "../../../assets/animation/parrot.json";
import TableComponent from "../../../components/SmallerComponents/TableComponent";
import styles from '@styles/AdvisorLayout/Clients/AllClients.module.css';
import SearchFilter from "../../../components/SmallerComponents/SearchFilter";
import { IoFilter } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteModal from "../../../components/SmallerComponents/DeleteModal";
import ClientDetailedInfoModal from "../../../components/SmallerComponents/ClientDetailedInfoModal/ClientDetailedInfoModal";
import { FaRegEye, FaRegEdit } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";

const AllClients = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [targetId, setTargetId] = useState(null);

    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [sorting, setSorting] = useState([]);

    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        fetchClients(pageIndex, pageSize, sorting, columnFilter);
    }, [pageIndex, pageSize, sorting, columnFilter]);

    const fetchClients = async (page = 0, size = 10, sorting = [], search = "") => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id || "";
            const sortOrder = sorting[0]?.desc ? "desc" : "asc";

            const res = await axios.get(`${url}/advisor/selectiveClients`, {
                params: {
                    page: page + 1,
                    limit: size,
                    search,
                    sortField,
                    sortOrder,
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
                const res = await axios.get(`${url}/advisor/clients/stats`);
                setSummary(res.data);
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
            await axios.delete(`${url}/advisor/clients/${targetId}`);
            setClients((curr) => curr.filter((client) => client._id !== targetId));
        } catch (e) {
            console.error(e);
            alert("Error deleting the client");
        } finally {
            setLoadingId(null);
            setTargetId(null);
        }
    };

    const columns = [
        {
            accessorKey: "fullName",
            header: "Full Name",
            size: 170,
            minSize: 150,
            cell: ({ row }) => (
                <Link
                    role="button"
                    className="text-dark p-0 text-decoration-none"
                    onClick={() => setSelectedClientId(row.original._id)}
                >
                    {row.original.fullName}
                </Link>
            ),
        },
        {
            accessorKey: "subscriptionStatus",
            header: "Subscription Status",
            size: 170,
            minSize: 100,
            cell: ({ getValue }) => {
                const value = getValue();
                let statusClass = "";
                if (value === "Active") statusClass = styles["active-status"];
                else if (value === "Expired") statusClass = styles["expired-status"];
                else if (value === "Up for Renewal") statusClass = styles["renewal-status"];
                else if (value === "Prospect") statusClass = styles["prospect-status"];
                else if (value === "Deadpool") statusClass = styles["deadpool-status"];
                return <span className={statusClass}>{value}</span>;
            },
        },
        {
            accessorKey: "email",
            header: "Email(s)",
            size: 220,
            minSize: 180,
            cell: ({ row }) =>
                row.original.email && row.original.email.length
                    ? row.original.email.join(", ")
                    : "N/A",
        },
        {
            accessorKey: "phones",
            header: "Phone Numbers",
            size: 150,
            minSize: 150,
            cell: ({ row }) => {
                const { countryCode, phone, countryCode2, phone2 } = row.original;
                const phoneList = [];
                if (countryCode || phone)
                    phoneList.push([countryCode, phone].filter(Boolean).join(" "));
                if (countryCode2 || phone2)
                    phoneList.push([countryCode2, phone2].filter(Boolean).join(" "));
                return phoneList.length > 0
                    ? phoneList.map((p, i) => <div key={i}>{p}</div>)
                    : "N/A";
            },
        },
        {
            accessorKey: "subscriptionDate",
            header: "Subscription Date",
            size: 160,
            minSize: 140,
            cell: ({ row }) =>
                row.original.subscriptionDate
                    ? new Date(row.original.subscriptionDate).toLocaleDateString("en-GB")
                    : "N/A",
        },
        {
            accessorKey: "_id",
            header: "Action",
            size: 110,
            minSize: 100,
            enableSorting: false,
            cell: ({ row }) => {
                const linkedinUrl = row.original.linkedinProfile;
                return (
                    <div className="d-flex gap-2">
                        {/* <Link
                            to={`/advisor/clients/${row.original._id}/editClients`}
                            className="btn p-2 btn-outline-turtle-secondary"
                        >
                            <FaRegEdit className="d-block fs-6" />
                        </Link> */}

                        <Link
                            to={`/advisor/clients/${row.original._id}/riskProfile`}
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
                            onClick={(e) => !linkedinUrl && e.preventDefault()}
                        >
                            <BsLinkedin className="d-block fs-6" />
                        </a>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="container-fluid">
            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-between mb-3 '>
                    <div>
                        <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>My Clients</h4>
                        <p className={`  ${styles.taskHeaderItem}`}>View and manage your assigned clients.</p>
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
                            { title: "Total Clients", desc: "All registered clients", value: summary?.total },
                            { title: "Active Membership", desc: "Currently active clients", value: summary?.active },
                            { title: "Up for Renewal", desc: "Coming up for renewal soon", value: summary?.upForRenewal },
                            { title: "Expired Membership", desc: "Currently expired clients", value: summary?.expired },
                            { title: "Deadpool", desc: "Inactive or closed clients", value: summary?.deadpool }
                        ].map((card, idx) => (
                            <div key={idx} className="col-sm-12 col-md text-center text-md-start">
                                <div className={`card p-4 h-100 d-flex flex-column justify-content-between ${styles.cardHover}`}>
                                    <div>
                                        <h4 className="fs-5 fw-bold">{card.title}</h4>
                                        <p className="fs-6 mb-2 text-secondary">{card.desc}</p>
                                    </div>
                                    <h2 className='fs-4 m-0 fw-bolder'>
                                        {loadingSummary ? '...' : card.value}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>




                    <div className={styles.clientsPageTableWrapper}>
                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle  px-3 bg-light-subtle">
                            <div className="my-3 bg-light-subtle d-flex justify-content-between">
                                <div>
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
