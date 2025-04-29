import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parrot from "@assets/animation/parrot.json"
import TableComponent from "@components/SmallerComponents/TableComponent"
import styles from '@styles/AdminLayout/Advisors/AllAdvisors.module.css'
import SearchFilter from '@components/SmallerComponents/SearchFilter'
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteModal from "../../../components/SmallerComponents/DeleteModal";


const AllAdvisors = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const [advisors, setAdvisors] = useState([]);
    const [filteredAdvisors, setFilteredAdvisors] = useState([]);// ✅ New state for filtered data
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState(""); // ✅ Search filter state



    useEffect(() => {
        fetchAdvisors();
    }, []);


    const fetchAdvisors = async () => {
        try {
            // const res = await axios.get("http://localhost:8000/advisors");
            // const res = await axios.get(`${url}/advisors`);
            const res = await axios.get(`${url}/admin/advisors`);
            // console.log(`${url}/advisors`);
            const reversedData = res.data.reverse();
            setAdvisors(reversedData);
            setFilteredAdvisors(res.data);
        } catch (err) {
            setError("Failed to fetch clients");
        } finally {
            setIsLoading(false);
        }
    };



    const handleDelete = async () => {
        if (!targetId) return;

        setLoadingId(targetId);
        try {
            await axios.delete(`${url}/admin/advisors/${targetId}`);
            setAdvisors((currAdvisor) =>
                currAdvisor.filter((advisor) => advisor._id !== targetId)
            );
        } catch (e) {
            console.error(e);
            alert("Error deleting the advisor");
        } finally {
            setLoadingId(null);
            setTargetId(null); // Clear the target after operation
        }
    };


    useEffect(() => {
        if (!columnFilter) {
            setFilteredAdvisors(advisors); // Reset when filter is empty
            return;
        }

        const lowerCaseFilter = columnFilter.toLowerCase();

        const filteredData = advisors.filter((advisor) =>
            Object.values(advisor).some(
                (value) =>
                    value &&
                    value.toString().toLowerCase().includes(lowerCaseFilter)
            )
        );

        setFilteredAdvisors(filteredData);
    }, [columnFilter, advisors]);


    const columns = [
        {
            accessorKey: "advisorFullName",
            header: "Advisor Name",
            enableResizing: true,
            size: 150,
            minSize: 150,
        },
        {
            accessorKey: "salutation",
            header: "Salutation",
            enableResizing: true,
            size: 120,
            minSize: 80,
        },
        {
            accessorKey: "advisorDomain",
            header: "Domain",
            enableResizing: true,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "countryCode",
            header: "Country Code",
            enableResizing: true,
            size: 140,
            minSize: 80,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            enableResizing: true,
            size: 120,
            minSize: 120,
        },
        {
            accessorKey: "email",
            header: "Email",
            enableResizing: true,
            size: 180,
            minSize: 150,
        },
        {
            accessorKey: "address",
            header: "Address",
            enableResizing: true,
            size: 180,
            minSize: 150,
        },
        {
            accessorKey: "dob",
            header: "Date of Birth",
            enableResizing: true,
            size: 140,
            minSize: 120,
            cell: ({ row }) =>
                row.original.dob ? new Date(row.original.dob).toLocaleDateString("en-GB") : "N/A",
        },
        {
            accessorKey: "gender",
            header: "Gender",
            enableResizing: true,
            size: 100,
            minSize: 80,
        },
        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 100,
            minSize: 80,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <Link
                        to={`/adminautharized/admin/advisors/${row.original._id}/editAdvisors`}
                        className="btn p-2 btn-outline-turtle-secondary"
                    >
                        <FaRegEdit className="d-block fs-6" />
                    </Link>

                    <button
                        type="button"
                        className="btn p-2 btn-outline-turtle-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => setTargetId(row.original._id)}
                        disabled={loadingId === row.original._id}
                    >
                        {loadingId === row.original._id ? "Deleting..." : <RiDeleteBin6Line className="d-block fs-6" />}
                    </button>
                </div>
            ),
        }

    ];


    return (
        <div className="container-fluid  ">
            <div className='d-flex align-items-center justify-content-between '>

                <div className='d-flex align-items-center justify-content-start mb-3 '>
                    <div>
                        <h4 className={`  ${styles.taskHeaderItem} fw-bold mb-1`}>Advisors</h4>
                        <p className={`  ${styles.taskHeaderItem}`}>View and manage all financial advisors on your team.</p>
                    </div>

                </div>
                <Link to="addAdvisor">
                    <button className="btn btn-custom-turtle-background">Create New Advisor</button>
                </Link>

            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>

                    <div className='mb-4 align-items-center row gx-3 gy-3 gy-lg-0'>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">Overdue</h4>
                                <p className="fs-6 mb-2">Tasks past due date</p>
                                <h2 className='fs-4 m-0 fw-bolder'>2</h2>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">Pending</h4>
                                <p className="fs-6 mb-2">Tasks past due date</p>
                                <h2 className='fs-4 m-0 fw-bolder'>2</h2>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">In Progress</h4>
                                <p className="fs-6 mb-2">Tasks past due date</p>
                                <h2 className='fs-4 m-0 fw-bolder'>2</h2>
                            </div>
                        </div>

                    </div>


                    <div className={styles.advisorsPageTableWrapper}>



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

                            <TableComponent data={filteredAdvisors}
                                columns={columns}
                                pageSize={10}
                                className={`${styles["custom-style-table"]}`}
                            />

                            <DeleteModal
                                modalId="deleteModal"
                                headerText="Confirm Deletion"
                                bodyContent="Are you sure you want to delete this Advisor?"
                                confirmButtonText="Delete"
                                onConfirm={() => handleDelete(targetId)}
                            />


                        </div>

                    </div>

                </Fragment>
            )}
        </div>
    )
}

export default AllAdvisors