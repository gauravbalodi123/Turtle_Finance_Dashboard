import React from "react";
import { CiSearch } from "react-icons/ci";
import styles from "@styles/SmallerComponents/SearchFilter/SearchFilter.module.css";

const SearchFilter = ({ columnFilter, setColumnFilter }) => {
    return (
        <div className=" d-none d-md-block d-flex justify-content-end">
            <div className={`input-group  ${styles.searchInput}`}> 
                <span className="input-group-text-search ">
                    <CiSearch className="d-block fs-5"/> 
                </span>
                <input 
                    type="text"
                    className="form-control-search"
                    placeholder="Search clients..."
                    value={columnFilter}
                    onChange={(e) => setColumnFilter(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SearchFilter;
