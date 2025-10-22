import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import parrot from "@assets/animation/parrot.json";
import TableComponent from "@components/SmallerComponents/TableComponent";
import styles from "../../../styles/ClientLayout/Advisor/AllAdvisors.module.css";
import SearchFilter from "@components/SmallerComponents/SearchFilter";
import { IoFilter, IoGrid, IoList } from "react-icons/io5"; // using icons for toggle
import { BsLinkedin } from "react-icons/bs";
import defaultAvatar from "../../../assets/images/turtle.png";

const AllAdvisors = () => {
    axios.defaults.withCredentials = true;
    const url = import.meta.env.VITE_URL;

    const [advisors, setAdvisors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const [viewCards, setViewCards] = useState(true); // toggle between cards and table

    // fetch advisors
    useEffect(() => {
        fetchAdvisors(pageIndex, pageSize, sorting, columnFilter);
    }, [pageIndex, pageSize, sorting, columnFilter]);

    const fetchAdvisors = async (page = 0, size = 10, sorting = [], search = "") => {
        setIsLoading(true);
        try {
            const sortField = sorting[0]?.id;
            const sortOrder = sorting[0]?.desc !== undefined ? (sorting[0].desc ? "desc" : "asc") : undefined;

            const params = { page: page + 1, limit: size, search };
            if (sorting.length && sortField && sortOrder) {
                params.sortField = sortField;
                params.sortOrder = sortOrder;
            }

            const res = await axios.get(`${url}/client/selectiveAdvisors`, { params });
            setAdvisors(res.data.advisors);
            setTotalCount(res.data.total);
        } catch (err) {
            console.error("Error fetching advisors:", err);
            setError("Failed to fetch advisors");
        } finally {
            setIsLoading(false);
        }
    };

    // fetch summary stats
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get(`${url}/client/advisors/stats`);
                setSummary(res.data);
            } catch (err) {
                console.error("Error fetching advisor summary:", err);
            } finally {
                setLoadingSummary(false);
            }
        };
        fetchSummary();
    }, []);

    const columns = [
        { accessorKey: "advisorFullName", header: "Advisor Name", enableResizing: true, size: 140, minSize: 100, sortDescFirst: true },
        { accessorKey: "status", header: "Status", enableResizing: true, size: 120, minSize: 80, sortDescFirst: true },
        { accessorKey: "salutation", header: "Salutation", enableResizing: true, size: 120, minSize: 80, sortDescFirst: true },
        {
            accessorKey: "advisorDomain", header: "Domain", enableResizing: true, size: 120, minSize: 80, sortDescFirst: true,
            cell: ({ row }) => row.original.advisorDomain?.length ? row.original.advisorDomain.join(", ") : "N/A"
        },
        {
            accessorKey: "email", header: "Email(s)", enableResizing: true, size: 220, minSize: 180, sortDescFirst: true,
            cell: ({ row }) => row.original.email?.length ? row.original.email.join(", ") : "N/A"
        },
        { accessorKey: "phone", header: "Phone", enableResizing: true, size: 120, minSize: 120, sortDescFirst: true },
        { accessorKey: "gender", header: "Gender", enableResizing: true, size: 90, minSize: 80, sortDescFirst: true },
        { accessorKey: "qualification", header: "Qualification", enableResizing: true, size: 160, minSize: 120, sortDescFirst: true },
        {
            accessorKey: "bio", header: "Bio", enableResizing: true, size: 200, minSize: 160, sortDescFirst: true,
            cell: ({ row }) => row.original.bio ? <span title={row.original.bio}>{row.original.bio.length > 40 ? row.original.bio.slice(0, 40) + "..." : row.original.bio}</span> : "N/A"
        },
        {
            accessorKey: "_id", header: "Action", enableResizing: false, size: 120, minSize: 80, enableSorting: false,
            cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <a href={row.original.linkedinProfile} target="_blank" rel="noopener noreferrer" className="btn p-2 btn-outline-turtle-secondary" title="View LinkedIn">
                        <BsLinkedin className="d-block fs-6" />
                    </a>
                </div>
            ),
        },
    ];

    return (
        <div className="container-fluid">
            {/* Header with Toggle */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h4 className={`${styles.taskHeaderItem} fw-bold mb-1`}>My Advisors</h4>
                    <p className={`${styles.taskHeaderItem}`}>View the list of advisors assigned to your account.</p>
                </div>
                <div>
                    <button
                        className={`btn btn-outline-turtle-secondary rounded-pill d-flex align-items-center gap-2`}
                        onClick={() => setViewCards(!viewCards)}
                    >
                        {viewCards ? <IoList /> : <IoGrid />}
                        {viewCards ? "Table View" : "Card View"}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : viewCards ? (
                // Card view
                <div className="row g-3 justify-content-start">
                    {advisors.map((advisor) => (
                        <div key={advisor._id} className="col-6 col-md-4 col-lg-2 d-flex">
                            <div className={`${styles.advisorCard} card shadow-sm flex-fill`}>
                                <div className="p-3 d-flex flex-column">
                                    <img
                                        src={advisor.avatar || defaultAvatar}
                                        alt={advisor.advisorFullName}
                                        className={styles.advisorImage}
                                    />
                                    <p className="fw-semibold small mb-0">{advisor.advisorFullName}</p>
                                    <p className="text-muted  small mb-2">{advisor.role || "Advisor"}</p>

                                    <div className="w-100 ">
                                        <div className="d-flex justify-content-between small text-muted ">
                                            <div>
                                                <strong className={styles.label}>Credentials</strong>
                                                <div>{advisor.credentials || "N/A"}</div>
                                            </div>
                                            <div>
                                                <strong className={styles.label}>Experience</strong>
                                                <div>{advisor.experience ? advisor.experience + " Years" : "N/A"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Hotline card */}
                    {/* <div className="col-6 col-md-4 col-lg-2 d-flex">
                        <div className={`${styles.advisorCard} card flex-fill text-center`}>
                            <div className="p-3 d-flex flex-column align-items-center justify-content-between">
                                <img
                                    src="/turtle-hotline.png"
                                    alt="Turtle Hotline"
                                    className={styles.hotlineImage}
                                />
                                <h6 className="fw-semibold mt-2">Turtle Hotline</h6>
                                <p className="text-muted small mb-2">24/7 Support</p>
                                <div className="d-flex justify-content-between small text-muted border-top pt-2 w-100">
                                    <div>
                                        <strong className={styles.label}>Availability</strong>
                                        <div>24/7</div>
                                    </div>
                                    <div>
                                        <strong className={styles.label}>Response</strong>
                                        <div>Immediate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

            ) : (
                // Table view
                <Fragment>
                    <div className="mb-4 align-items-center row gx-3 gy-3 gy-lg-0">
                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-4 ${styles}`}>
                                <h4 className="fs-5 fw-bold">Total Advisors</h4>
                                <p className="fs-6 mb-2">Assigned to your profile</p>
                                <h2 className="fs-4 m-0 fw-bolder">{loadingSummary ? "..." : summary?.total ?? 0}</h2>
                            </div>
                        </div>
                    </div>

                    <div className={styles.advisorsPageTableWrapper}>
                        <div className="table-responsive border border-1 rounded-4 border-secondary-subtle px-3 bg-light-subtle">
                            <div className="my-3 bg-light-subtle d-flex justify-content-between">
                                <div>
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
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default AllAdvisors;
