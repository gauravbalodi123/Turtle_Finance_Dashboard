import React from "react";
import { FaSearch } from "react-icons/fa"; // ✅ Import Search Icon
import styles from "../../styles/Clients/SearchFilter.module.css";

const SearchFilter = ({ columnFilter, setColumnFilter }) => {
    return (
        <div className="mb-2 d-flex justify-content-end">
            <div className={`input-group  ${styles.searchInput}`}> 
                <span className="input-group-text ">
                    <FaSearch/> 
                </span>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Search clients..."
                    value={columnFilter}
                    onChange={(e) => setColumnFilter(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SearchFilter;
