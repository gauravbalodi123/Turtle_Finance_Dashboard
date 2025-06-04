import React from "react";

const BaseAddModal = ({ id, title, children, onSubmit, loading }) => {
  return (
    <div className="modal fade" id={id} data-bs-backdrop="static" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-scrollable modal-md modal-dialog-centered">
        <div className="modal-content">

          <form onSubmit={onSubmit}>

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body" style={{ maxHeight: "70vh" }}>
              {children}
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-turtle-primary"
                // data-bs-dismiss="modal"
                disabled={loading}
              >
                {loading ? "Adding..." : "Send Onboarding Details"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BaseAddModal;
