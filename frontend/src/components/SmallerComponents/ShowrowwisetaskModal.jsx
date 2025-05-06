import React, { Fragment } from "react";

const ShowrowwisetaskModal = ({
  modalId = "showRowWiseTaskModal",
  item = {},
  statusClasses = {}
}) => {
  return (
    <Fragment>
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={`${modalId}Label`}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content ">
            <div className="modal-header border-bottom-0 py-2">
              <div>
                <h5 className="modal-title">Task Details</h5>

              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body pt-0 ">
              <div className="mb-3">
                <p className="fw-bold fs-6 mb-2" id={`${modalId}Label`}>
                  {item.actionItems || "No Action Item"}
                </p>
                <span
                  className={`mt-2  ${item.status === "Completed"
                      ? statusClasses.completed
                      : item.status === "Pending"
                        ? statusClasses.pending
                        : item.status === "Overdue"
                          ? statusClasses.overdue
                          : ""
                    }`}
                >
                  {item.status || "No Status"}
                </span>


              </div>

              <ul className="list-unstyled mb-0">
                <li className="row mb-2">
                  <div className="col-3 text-black-50">Client:</div>
                  <div className="col-9 text-black">{item.client || "N/A"}</div>
                </li>
                <li className="row mb-2">
                  <div className="col-3 text-black-50">Advisor:</div>
                  <div className="col-9 text-black">{item.advisor || "N/A"}</div>
                </li>
                <li className="row mb-2">
                  <div className="col-3 text-black-50">Responsible Person:</div>
                  <div className="col-9 text-black">{item.responsiblePerson || "N/A"}</div>
                </li>
                <li className="row mb-2">
                  <div className="col-3 text-black-50">Due Date:</div>
                  <div className="col-9 text-black">{item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB') : "N/A"}</div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShowrowwisetaskModal;
