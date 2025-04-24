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
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const AllClients = () => {
    axios.defaults.withCredentials = true
    // const url = "http://localhost:8000";
    const url = import.meta.env.VITE_URL;
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]); // ✅ New state for filtered data
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState(""); // ✅ Search filter state

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await axios.get(`${url}/admin/clients`);
            const reversedData = res.data.reverse();
            setClients(reversedData);
            setFilteredClients(res.data); // ✅ Initialize filtered data
        } catch (err) {
            setError("Failed to fetch clients");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {

        setLoadingId(id);
        try {

            await axios.delete(`${url}/admin/clients/${id}`)
            alert("Client has been deleted successfully");
            setClients((currClients) => currClients.filter((client) => client._id !== id));
        }
        catch (e) {
            console.log(e);
            alert("error deleting the client")
        }
        finally {
            setLoadingId(null);
        }
    }


    // ✅ Filter logic: Runs whenever columnFilter or clients change
    useEffect(() => {
        if (!columnFilter) {
            setFilteredClients(clients); // Reset when filter is empty
            return;
        }

        const lowerCaseFilter = columnFilter.toLowerCase();

        const filteredData = clients.filter((client) =>
            Object.values(client).some(
                (value) =>
                    value &&
                    value.toString().toLowerCase().includes(lowerCaseFilter)
            )
        );

        setFilteredClients(filteredData);
    }, [columnFilter, clients]);

    const columns = [
        { accessorKey: "fullName", header: "Full Name", enableResizing: true, size: 250, minSize: 150 },
        { accessorKey: "salutation", header: "Salutation", enableResizing: true, size: 180, minSize: 80 },
        { accessorKey: "leadSourceId", header: "Lead Source ID", enableResizing: true, size: 200, minSize: 120 },
        { accessorKey: "leadSource", header: "Lead Source", enableResizing: true, size: 180, minSize: 140 },
        {
            accessorKey: "subscriptionStatus",
            header: "Subscription Status",
            enableResizing: true,
            size: 200,
            minSize: 160,
            cell: ({ getValue }) => {
                const value = getValue();
                let statusClass = "";

                if (value === "Active") statusClass = styles["active-status"];
                else if (value === "Expired") statusClass = styles["expired-status"];
                else if (value === "Up for Renewal") statusClass = styles["renewal-status"];

                return <span className={statusClass}>{value}</span>;
            }
        },
        { accessorKey: "gender", header: "Gender", enableResizing: true, size: 100, minSize: 80 },
        { accessorKey: "countryCode", header: "Country Code", enableResizing: true, size: 160, minSize: 130 },
        { accessorKey: "phone", header: "Phone", enableResizing: true, size: 160, minSize: 130 },
        { accessorKey: "email", header: "Email", enableResizing: true, size: 250, minSize: 200 },
        { accessorKey: "address", header: "Address", enableResizing: true, size: 300, minSize: 200 },
        {
            accessorKey: "subscriptionDate",
            header: "Subscription Date",
            enableResizing: true,
            size: 180,
            minSize: 140,
            cell: ({ row }) =>
                row.original.subscriptionDate
                    ? new Date(row.original.subscriptionDate).toLocaleDateString("en-GB")
                    : "N/A",
        },
        {
            accessorKey: "subscriptionDue",
            header: "Subscription Due",
            enableResizing: true,
            size: 180,
            minSize: 140,
            cell: ({ row }) =>
                row.original.subscriptionDue
                    ? new Date(row.original.subscriptionDue).toLocaleDateString("en-GB")
                    : "N/A",
        },
        {
            accessorKey: "riskProfileDate",
            header: "Risk Profile Date",
            enableResizing: true,
            size: 180,
            minSize: 140,
            cell: ({ row }) =>
                row.original.riskProfileDate
                    ? new Date(row.original.riskProfileDate).toLocaleDateString("en-GB")
                    : "N/A",
        },
        {
            accessorKey: "kickOffDate",
            header: "Kick Off Date",
            enableResizing: true,
            size: 180,
            minSize: 140,
            cell: ({ row }) =>
                row.original.kickOffDate
                    ? new Date(row.original.kickOffDate).toLocaleDateString("en-GB")
                    : "N/A",
        },
        {
            accessorKey: "onboardingStatus",
            header: "Onboarding Status",
            enableResizing: true,
            size: 200,
            minSize: 160,
            cell: ({ getValue }) => {
                const status = getValue();
                let className = "";

                if (status === "Not Started") className = styles["not-started"];
                else if (status === "RIA Allocated") className = styles["ria-allocated"];
                else if (status === "Payment Received") className = styles["payment-received"];
                else if (status === "Risk Profile Done") className = styles["risk-profile"];
                else if (status === "Kick Off Done") className = styles["kick-off"];
                else if (status === "Contract Signed") className = styles["contract-signed"];

                return <span className={className}>{status}</span>;
            }
        },
        {
            accessorKey: "dob",
            header: "Date of Birth",
            enableResizing: true,
            size: 180,
            minSize: 140,
            cell: ({ row }) =>
                row.original.dob ? new Date(row.original.dob).toLocaleDateString("en-GB") : "N/A",
        },
        { accessorKey: "companyName", header: "Company Name", enableResizing: true, size: 250, minSize: 200 },
        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 150,
            minSize: 120,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <Link to={`/adminautharized/admin/clients/${row.original._id}/editClients`} className="btn  p-2  btn-outline-turtle-secondary">
                        <FaRegEdit className="d-block fs-6" />
                    </Link>
                    <button onClick={() => { handleDelete(row.original._id) }} disabled={loadingId === row.original._id} className="btn  p-2  btn-outline-turtle-secondary">
                        {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
                    </button>
                </div>
            ),
        },
    ];


    return (
        <div className="container-fluid ">
            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-start mb-3 '>
                    <div>
                        <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>Clients</h4>
                        <p className={`  ${styles.taskHeaderItem}`}>View and manage all client accounts and memberships.</p>
                    </div>

                </div>

                <Link to="addTask">
                    <button className="btn btn-custom-turtle-background d-none">Create New Task</button>
                </Link>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>

                    <div className='mb-4 align-items-center row gx-3 gy-3 gy-lg-0'>

                        <div className="col-12 col-md-3 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">Total Clients</h4>
                                <p className="fs-6 mb-2 text-secondary">All registered clients</p>
                                <h2 className='fs-4 m-0 fw-bolder'>2</h2>
                            </div>
                        </div>

                        <div className="col-12 col-md-3 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">Active Membership</h4>
                                <p className="fs-6 mb-2 text-secondary">Currently active clients</p>
                                <h2 className='fs-4 m-0 fw-bolder'>2</h2>
                            </div>
                        </div>

                        <div className="col-12 col-md-3 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">Expired Membership</h4>
                                <p className="fs-6 mb-2 text-secondary">Currently Expired clients</p>
                                <h2 className='fs-4 m-0 fw-bolder'>2</h2>
                            </div>
                        </div>

                        <div className="col-12 col-md-3 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">Total Revenue</h4>
                                <p className="fs-6 mb-2 text-secondary">From all client contracts</p>
                                <h2 className='fs-4 m-0 fw-bolder'>2</h2>
                            </div>
                        </div>

                    </div>


                    <div className={styles.clientsPageTableWrapper}>

                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle  px-3 bg-light-subtle">

                            <div className="my-3 bg-light-subtle d-flex justify-content-between " >
                                <div className="">
                                    <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} />
                                </div>

                                <div>
                                    <button className="d-flex align-items-center justify-content-between text-align-center btn btn-outline-turtle-secondary ">
                                        <IoFilter className="text-align-center me-2" />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <TableComponent data={filteredClients}
                                columns={columns}
                                pageSize={10}
                                className={`${styles["custom-style-table"]}`}
                            />
                        </div>

                    </div>

                </Fragment>
            )}
        </div>
    );
};

export default AllClients;
