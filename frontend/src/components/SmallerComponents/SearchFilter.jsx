import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import styles from "@styles/SmallerComponents/SearchFilter/SearchFilter.module.css";

const SearchFilter = ({ columnFilter, setColumnFilter }) => {
    const [localFilter, setLocalFilter] = useState(columnFilter || "");

    const handleSearch = () => {
        setColumnFilter(localFilter.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="d-none d-md-flex justify-content-between gap-2">

            <div className={`input-group ${styles.searchInput} `}>
                <span className="input-group-text-search">
                    <CiSearch className="d-block fs-5" />
                </span>
                <input
                    type="text"
                    className="form-control-search"
                    placeholder="Search clients..."
                    value={localFilter}
                    onChange={(e) => setLocalFilter(e.target.value)}
                    onKeyDown={handleKeyDown} // allow Enter key too
                />

            </div>

            <button
                className="btn btn-turtle-primary"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
};

export default SearchFilter;
