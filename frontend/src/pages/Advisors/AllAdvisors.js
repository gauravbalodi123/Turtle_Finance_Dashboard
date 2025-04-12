import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parrot from "../../assets/animation/parrot.json"
import TableComponent from "../../components/SmallerComponents/TableComponent"
import styles from '../../styles/Advisors/AllAdvisors.module.css'
import SearchFilter from '../../components/SmallerComponents/SearchFilter'
import { FaEdit, FaTrash } from "react-icons/fa";


const AllAdvisors = () => {
    const url = process.env.REACT_APP_HOSTED_URL;
    const [advisors, setAdvisors] = useState([]);
    const [filteredAdvisors, setFilteredAdvisors] = useState([]);// ✅ New state for filtered data
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [columnFilter, setColumnFilter] = useState(""); // ✅ Search filter state



    useEffect(() => {
        fetchAdvisors();
    }, []);


    const fetchAdvisors = async () => {
        try {
            // const res = await axios.get("http://localhost:8000/advisors");
            // const res = await axios.get(`${url}/advisors`);
            const res = await axios.get(`${url}/advisors`);
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



    const handleDelete = async (id) => {

        setLoadingId(id);
        try {

            await axios.delete(`${url}/advisors/${id}`)
            alert("Advisor has been deleted successfully");
            setAdvisors((currAdvisor) => currAdvisor.filter((advisor) => advisor._id !== id));
        }
        catch (e) {
            console.log(e);
            alert("error deleting the advisor")
        }
        finally {
            setLoadingId(null);
        }
    }

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
            size: 200,
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
            size: 180,
            minSize: 120,
        },
        {
            accessorKey: "countryCode",
            header: "Country Code",
            enableResizing: true,
            size: 150,
            minSize: 80,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            enableResizing: true,
            size: 160,
            minSize: 120,
        },
        {
            accessorKey: "email",
            header: "Email",
            enableResizing: true,
            size: 200,
            minSize: 150,
        },
        {
            accessorKey: "address",
            header: "Address",
            enableResizing: true,
            size: 250,
            minSize: 150,
        },
        {
            accessorKey: "dob",
            header: "Date of Birth",
            enableResizing: true,
            size: 150,
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
            size: 150,
            minSize: 120,
            cell: ({ row }) => (
                <div className="d-flex  gap-2">
                    <Link to={`/advisors/${row.original._id}/editAdvisors`} className="btn btn-primary btn-sm">
                        <FaEdit />
                    </Link>
                    <button onClick={() => { handleDelete(row.original._id) }} disabled={loadingId === row.original._id} className="btn btn-danger btn-sm">
                        {loadingId === row.original._id ? "Deleting..." : <FaTrash />}
                    </button>
                </div>
            ),
        },
    ];


    return (
        <div className="container-fluid  ">
            <h2 className="text-start">Advisors</h2>

            {isLoading ? (
                <Lottie className="d-block mx-auto w-25 h-25 top-0" animationData={parrot} />
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <Fragment>

                    <div className='mb-4 align-items-center row gx-3 gy-3 gy-lg-0 '>

                        <div className="col-12  col-lg-4 text-center text-md-start ">
                            <div className={` card p-3 ${styles}`}>
                                <h4>Overdue</h4>
                                <p>Tasks past due date</p>
                                <h2 className='m-0'>2</h2>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card  p-3 ${styles}`}>
                                <h4>Pending</h4>
                                <p>Tasks past due date</p>
                                <h2 className='m-0'>2</h2>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4 text-center text-md-start">
                            <div className={`card p-3 ${styles}`}>
                                <h4>In Progress</h4>
                                <p>Tasks past due date</p>
                                <h2 className='m-0'>2</h2>
                            </div>
                        </div>
                    </div>

                    <div className={styles.advisorsPageTableWrapper}>

                        <SearchFilter columnFilter={columnFilter} setColumnFilter={setColumnFilter} />

                        <div className="table-responsive">
                            <TableComponent data={filteredAdvisors}
                                columns={columns}
                                pageSize={10}
                                className={`${styles["custom-style-table"]}`}
                            />
                        </div>

                    </div>

                </Fragment>
            )}
        </div>
    )
}

export default AllAdvisors