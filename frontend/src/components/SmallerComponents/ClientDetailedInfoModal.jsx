import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";

const ClientDetailedInfoModal = ({ modalId = "clientDetailModal", clientId }) => {
  const url = import.meta.env.VITE_URL;
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);

    axios
      .get(`${url}/admin/clients/${clientId}/editClients`, { withCredentials: true })
      .then((res) => {
        setClientData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching client details:", err);
        setLoading(false);
      });
  }, [clientId, url]);

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
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title fw-bold" id={`${modalId}Label`}>
                  {loading
                    ? "Loading..."
                    : `${clientData?.fullName || "No Name"}`}{" "}
                  {clientData?.status && (
                    <span
                      className={`badge ms-2 ${clientData.status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                        }`}
                    >
                      {clientData.status}
                    </span>
                  )}
                </h5>
                <p className="text-muted mb-0">
                  {clientData?.email || "No Email"}
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/* Tabs */}
              <ul className="nav nav-tabs mb-3" id="clientTabs" role="tablist">
                {["Summary View", "Meeting Notes", "Pending Tasks", "General Info"].map(
                  (tab, idx) => (
                    <li className="nav-item" role="presentation" key={idx}>
                      <button
                        className={`nav-link ${idx === 0 ? "active" : ""}`}
                        id={`tab-${idx}`}
                        data-bs-toggle="tab"
                        data-bs-target={`#content-${idx}`}
                        type="button"
                        role="tab"
                        aria-controls={`content-${idx}`}
                        aria-selected={idx === 0 ? "true" : "false"}
                      >
                        {tab}
                      </button>
                    </li>
                  )
                )}
              </ul>

              {/* Tab content */}
              <div className="tab-content" id="clientTabsContent">
                {/* Summary View Tab */}
                <div
                  className="tab-pane fade show active"
                  id="content-0"
                  role="tabpanel"
                  aria-labelledby="tab-0"
                >
                  {loading ? (
                    <p>Loading client info...</p>
                  ) : (
                    <>
                      <div className="mb-3">
                        <h6 className="fw-bold">Client Bio</h6>
                        <p>{clientData?.bio || "No bio available"}</p>
                        {clientData?.linkedin && (
                          <a
                            href={clientData.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary text-decoration-none"
                          >
                            🔗 LinkedIn Profile
                          </a>
                        )}
                      </div>

                      <div className="row g-3">
                        <div className="col-md-3">
                          <div className="border rounded p-3 h-100">
                            <div className="text-muted">📅 Membership Expiry</div>
                            <div className="fw-bold">
                              {clientData?.subscriptionDue || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3 h-100">
                            <div className="text-muted">
                              👥 Advisors Assigned ({clientData?.advisors?.length || 0})
                            </div>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {clientData?.advisors?.length
                                ? clientData.advisors.map((name, i) => (
                                  <span
                                    key={i}
                                    className="badge bg-light text-dark border"
                                  >
                                    {name}
                                  </span>
                                ))
                                : "No advisors"}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="border rounded p-3 h-100 text-center">
                            <div className="text-muted">📞 Calls</div>
                            <div className="fw-bold fs-5">{clientData?.calls || 0}</div>
                            <div className="text-success">completed</div>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="border rounded p-3 h-100 text-center">
                            <div className="text-muted">⏰ Last Call</div>
                            <div className="fw-bold fs-5">
                              {clientData?.lastCallDaysAgo || "N/A"}
                            </div>
                            <div className="text-muted">days ago</div>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="border rounded p-3 h-100 text-center">
                            <div className="text-muted">📋 Tasks</div>
                            <div>
                              Pending:{" "}
                              <span className="fw-bold">
                                {clientData?.pendingTasks || 0}
                              </span>
                            </div>
                            <div className="text-danger">
                              Overdue:{" "}
                              <span className="fw-bold">
                                {clientData?.overdueTasks || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Bookings Placeholder */}
                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="fw-bold mb-0">Recent Bookings</h6>
                          <button className="btn btn-sm btn-outline-primary">
                            View All
                          </button>
                        </div>
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>Advisor</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan="3" className="text-center text-muted">
                                No bookings available
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>

                {/* Other Tabs Placeholder */}
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="tab-pane fade"
                    id={`content-${idx}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${idx}`}
                  >
                    <p className="text-muted">Content for tab {idx + 1} goes here.</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ClientDetailedInfoModal;
