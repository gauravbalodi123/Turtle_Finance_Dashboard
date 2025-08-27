import React, { Fragment, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";

import { FaSort, FaSortUp, FaSortDown, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import styles from "../../styles/SmallerComponents/TableComponent/TableComponent.module.css";

const TableComponent = ({ data, columns, pageIndex, pageSize, setPageIndex, setPageSize, totalCount, className, sorting,setSorting, }) => {

    const table = useReactTable({
        data,
        columns,
        manualPagination: true, 
        manualSorting: true,   
        pageCount: Math.ceil(totalCount / pageSize), // ✅ required for server pagination
        state: {
            pagination: { pageIndex, pageSize },
            sorting: sorting
        },
        onPaginationChange: (updater) => {
            const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);
        },
        onSortingChange: setSorting, // ✅ handle sorting changes
        getCoreRowModel: getCoreRowModel(), // ✅ always required
        columnResizeMode: "onChange",
        enableSortingRemoval: true,
    });

    useEffect(() => {
        const initializeTooltips = () => {
            const tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipElements.forEach(el => {
                try {
                    const existingTooltip = bootstrap.Tooltip.getInstance(el);
                    if (existingTooltip) {
                        existingTooltip.dispose();
                    }
                    new bootstrap.Tooltip(el);
                } catch (err) {
                    console.error("Tooltip error:", err);
                }
            });
        };

        initializeTooltips(); // 🛠 Re-initialize tooltips on page change
    }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize]);

    return (
        <Fragment>
            <div className={` table-responsive ${className || ""}`}>
                <table className="table-custom table-borderless table-hover">
                    <thead className="border-top w-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={{
                                            position: "relative",
                                            width: `${header.column.getSize()}px`,
                                            cursor: header.column.getCanSort() ? "pointer" : "default",
                                        }}
                                    >
                                        <span>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </span>
                                        {header.column.getCanSort() && (
                                            <span
                                                className="ms-2"
                                                onClick={
                                                    header.column.getCanSort()
                                                        ? header.column.getToggleSortingHandler()
                                                        : undefined
                                                }
                                            >
                                                {header.column.getIsSorted() === "asc" ? (
                                                    <FaSortUp />
                                                ) : header.column.getIsSorted() === "desc" ? (
                                                    <FaSortDown />
                                                ) : (
                                                    <FaSort />
                                                )}
                                            </span>
                                        )}
                                        <div
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                            className={`${styles.resizer} ${header.column.getIsResizing() ? styles.resizing : ""
                                                }`}
                                        />
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex mt-sm-2 flex-column  justify-content-center align-items-center  flex-md-row justify-content-md-between mt-md-2  ">
                <div className="mb-3 mb-md-0">
                    <label className="me-2">Showing</label>
                    <select
                        className="form-select d-inline-block w-auto"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 15, 20].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="ms-2">entries of {totalCount} total rows</span>
                </div>

                <div>


                    <ul className="pagination justify-content-center">
                        {/* First Page Button */}
                        <li className={`page-item ${!table.getCanPreviousPage() ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <FaAngleDoubleLeft />
                            </button>
                        </li>

                        {(() => {
                            const pageCount = table.getPageCount();
                            const currentPage = table.getState().pagination.pageIndex;
                            const maxVisible = 5;
                            const pages = [];

                            let start = Math.max(1, currentPage + 1 - Math.floor(maxVisible / 2));
                            let end = start + maxVisible - 1;

                            if (end > pageCount) {
                                end = pageCount;
                                start = Math.max(1, end - maxVisible + 1);
                            }

                            // Always show first page if not in range
                            if (start > 1) {
                                pages.push(
                                    <li key="first" className="page-item">
                                        <button className="page-link" onClick={() => table.setPageIndex(0)}>
                                            1
                                        </button>
                                    </li>
                                );
                                if (start > 2) {
                                    pages.push(
                                        <li key="start-ellipsis" className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    );
                                }
                            }

                            for (let i = start; i <= end; i++) {
                                pages.push(
                                    <li key={i} className={`page-item ${i - 1 === currentPage ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => table.setPageIndex(i - 1)}>
                                            {i}
                                        </button>
                                    </li>
                                );
                            }

                            // Always show last page if not in range
                            if (end < pageCount) {
                                if (end < pageCount - 1) {
                                    pages.push(
                                        <li key="end-ellipsis" className="page-item disabled">
                                            <span className="page-link">...</span>
                                        </li>
                                    );
                                }
                                pages.push(
                                    <li key="last" className="page-item">
                                        <button className="page-link" onClick={() => table.setPageIndex(pageCount - 1)}>
                                            {pageCount}
                                        </button>
                                    </li>
                                );
                            }

                            return pages;
                        })()}

                        {/* Last Page Button */}
                        <li className={`page-item ${!table.getCanNextPage() ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <FaAngleDoubleRight />
                            </button>
                        </li>
                    </ul>


                </div>
            </div>
        </Fragment>
    );
};


export default TableComponent;
