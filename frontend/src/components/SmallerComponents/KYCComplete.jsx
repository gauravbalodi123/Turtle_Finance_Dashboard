import React from "react";
import { BsCheckCircle } from "react-icons/bs";

const KYCComplete = ({ data = {}, onNext, onPrev, onModify }) => {
  const uploaded = data?.kyc?.files || [];

  const handleModify = () => {
    if (typeof onModify === "function") return onModify();
    if (typeof onPrev === "function") return onPrev();
  };

  return (
    <div className="container-fluid p-0">
      <div className="bg-white border rounded shadow-sm p-4 text-center">
        <div className="mb-4">
          <BsCheckCircle className="text-success" size={64} />
        </div>

        <h4 className="fw-bold mb-3">KYC Documents Uploaded</h4>

        <p className="text-muted mb-3">
          Thanks — we’ve received your KYC documents. Our compliance team will verify them shortly.
        </p>

        {uploaded.length > 0 && (
          <div className="bg-light border rounded py-3 px-4 mb-4 text-start">
            <p className="mb-1">
              <strong>Uploaded documents:</strong>
            </p>
            <ul className="mb-0 small">
              {uploaded.map((f, idx) => (
                <li key={idx} className="d-flex justify-content-between align-items-center">
                  <span>{f.name || f.filename || `Document ${idx + 1}`}</span>
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noreferrer" className="small">
                      View
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-secondary small mb-3">Verification typically completes within 24–48 hours. We will notify you once it is done.</p>

        <div className="d-flex justify-content-center gap-3">
          {/* <button className="btn btn-outline-dark" onClick={handleModify}>
            Modify Documents
          </button> */}
          <button className="btn btn-success px-4" onClick={onNext}>
            Continue to Agreement
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCComplete;
