// SearchFilter.jsx
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import styles from "@styles/SmallerComponents/SearchFilter/SearchFilter.module.css";

const SearchFilter = ({ columnFilter, setColumnFilter ,setSelectedClientId }) => {
    const [localFilter, setLocalFilter] = useState(columnFilter || "");

    const handleSearch = () => {
        setColumnFilter(localFilter.trim());
        setSelectedClientId(null); // ✅ clear selected client so modal won’t auto-open , very important
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setColumnFilter(localFilter.trim());
            setSelectedClientId(null); // ✅ important
        }
    };


    return (
        // "search-area" class used by row guard below
        <div
            className="search-area d-none d-md-flex justify-content-between gap-2"
            // pointerdown is earlier than click and will block parent pointer listeners
            onPointerDown={(e) => {
                e.stopPropagation();
                e.nativeEvent && e.nativeEvent.stopImmediatePropagation && e.nativeEvent.stopImmediatePropagation();
            }}
            // block Enter on wrapper as well
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent && e.nativeEvent.stopImmediatePropagation && e.nativeEvent.stopImmediatePropagation();
                }
            }}
        >
            <div className={`input-group ${styles.searchInput}`}>
                <span className="input-group-text-search">
                    <CiSearch className="d-block fs-5" />
                </span>
                <input
                    type="text"
                    className="form-control-search"
                    placeholder="Search clients..."
                    value={localFilter}
                    onChange={(e) => setLocalFilter(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Crucial: type="button" */}
            <button type="button" className="btn btn-turtle-primary" onClick={handleSearch}>
                Search
            </button>
        </div>
    );
};

export default SearchFilter;
