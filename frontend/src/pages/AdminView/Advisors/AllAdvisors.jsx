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
import { BsLinkedin } from "react-icons/bs";
import DeleteModal from "../../../components/SmallerComponents/DeleteModal";


const AllAdvisors = () => {
    axios.defaults.withCredentials = true
    const url = import.meta.env.VITE_URL;
    const [advisors, setAdvisors] = useState([]);
    // const [filteredAdvisors, setFilteredAdvisors] = useState([]);// ✅ New state for filtered data
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState(""); // ✅ Search filter state

    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const [sorting, setSorting] = useState([]);



    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);


    useEffect(() => {
        fetchAdvisors(pageIndex, pageSize, sorting, columnFilter);
    }, [pageIndex, pageSize, sorting, columnFilter]);


    const fetchAdvisors = async (page = 0, size = 10, sorting = [], search = "") => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id;
            const sortOrder = sorting[0]?.desc !== undefined
                ? (sorting[0].desc ? "desc" : "asc")
                : undefined;

            const params = {
                page: page + 1,
                limit: size,
                search
            };

            // Only include sort params if they're valid
            if (sorting.length && sortField && sortOrder) {
                params.sortField = sortField;
                params.sortOrder = sortOrder;
            }


            const res = await axios.get(`${url}/admin/selectiveAdvisors`, {
                params
            });

            setAdvisors(res.data.advisors);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error("Error fetching advisors:", err);
            setError("Failed to fetch advisors");
        } finally {
            setIsLoading(false);
        }
    };



    // useEffect(() => {
    //     const fetchSummary = async () => {
    //         try {
    //             const res = await axios.get(`${url}/admin/advisors/stats`);
    //             setSummary(res.data); // expected: { total, active, inactive }
    //         } catch (err) {
    //             console.error("Error fetching advisor summary:", err);
    //         } finally {
    //             setLoadingSummary(false);
    //         }
    //     };

    //     fetchSummary();
    // }, []);



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


    // useEffect(() => {
    //     if (!columnFilter) {
    //         setFilteredAdvisors(advisors); // Reset when filter is empty
    //         return;
    //     }

    //     const lowerCaseFilter = columnFilter.toLowerCase();

    //     const filteredData = advisors.filter((advisor) =>
    //         Object.values(advisor).some(
    //             (value) =>
    //                 value &&
    //                 value.toString().toLowerCase().includes(lowerCaseFilter)
    //         )
    //     );

    //     setFilteredAdvisors(filteredData);
    // }, [columnFilter, advisors]);


    const columns = [
        {
            accessorKey: "advisorFullName",
            header: "Advisor Name",
            enableResizing: true,
            size: 140,
            minSize: 100,
            sortDescFirst: true,
        },
        {
            accessorKey: "status",
            header: "Status",
            enableResizing: true,
            size: 120,
            minSize: 80,
            sortDescFirst: true,
        },
        {
            accessorKey: "salutation",
            header: "Salutation",
            enableResizing: true,
            size: 120,
            minSize: 80,
            sortDescFirst: true,
        },
        {
            accessorKey: "advisorDomain",
            header: "Domain",
            enableResizing: true,
            size: 120,
            minSize: 80,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.advisorDomain && row.original.advisorDomain.length
                    ? row.original.advisorDomain.join(", ")
                    : "N/A",
        },
        {
            accessorKey: "eventName",
            header: "Event Name",
            enableResizing: true,
            size: 140,
            minSize: 100,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.eventName && row.original.eventName.length
                    ? row.original.eventName.join(", ")
                    : "N/A",
        },
        {
            accessorKey: "countryCode",
            header: "Country Code",
            enableResizing: true,
            size: 140,
            minSize: 80,
            sortDescFirst: true,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            enableResizing: true,
            size: 120,
            minSize: 120,
            sortDescFirst: true,
        },
        {
            accessorKey: "countryCode2",
            header: "Country Code 2",
            enableResizing: true,
            size: 145,
            minSize: 80,
            sortDescFirst: true,
        },
        {
            accessorKey: "phone2",
            header: "Phone2",
            enableResizing: true,
            size: 120,
            minSize: 120,
            sortDescFirst: true,
        },
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
        // {
        //     accessorKey: "address",
        //     header: "Address",
        //     enableResizing: true,
        //     size: 160,
        //     minSize: 150,
        //     sortDescFirst: true,
        // },
        {
            accessorKey: "dob",
            header: "Date of Birth",
            enableResizing: true,
            size: 140,
            minSize: 120,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.dob ? new Date(row.original.dob).toLocaleDateString("en-GB") : "N/A",
        },
        {
            accessorKey: "gender",
            header: "Gender",
            enableResizing: true,
            size: 90,
            minSize: 80,
            sortDescFirst: true,
        },
        {
            accessorKey: "qualification",
            header: "Qualification",
            enableResizing: true,
            size: 160,
            minSize: 120,
            sortDescFirst: true,
        },
        // {
        //     accessorKey: "experience",
        //     header: "Experience (yrs)",
        //     enableResizing: true,
        //     size: 150,
        //     minSize: 100,
        //     sortDescFirst: true,
        // },
        // {
        //     accessorKey: "credentials",
        //     header: "Credentials",
        //     enableResizing: true,
        //     size: 180,
        //     minSize: 150,
        //     sortDescFirst: true,
        // },
        {
            accessorKey: "bio",
            header: "Bio",
            enableResizing: true,
            size: 200,
            minSize: 160,
            sortDescFirst: true,
            cell: ({ row }) =>
                row.original.bio ? (
                    <span title={row.original.bio}>
                        {row.original.bio.length > 40
                            ? row.original.bio.slice(0, 40) + "..."
                            : row.original.bio}
                    </span>
                ) : "N/A",
        },

        {
            accessorKey: "_id",
            header: "Action",
            enableResizing: false,
            size: 140,
            minSize: 80,
            enableSorting: false,
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


                    <a
                        href={row.original.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn p-2 btn-outline-turtle-secondary"
                        title="View LinkedIn"
                    >
                        <BsLinkedin className="d-block fs-6" />
                    </a>

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

                            <TableComponent
                                data={advisors}
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