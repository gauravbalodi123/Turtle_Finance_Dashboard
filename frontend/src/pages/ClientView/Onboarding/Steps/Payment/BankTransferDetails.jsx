// src/pages/ClientView/Payment/BankTransferDetails.jsx
import React, { useState } from "react";

const BANK_DETAILS = {
  "Account Name": "Mukund Lahoty",
  "Account Number": "50100233410920",
  "Ifsc Code": "HDFC0001098",
  "Bank Name": "HDFC Bank",
};

const BankTransferDetails = () => {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="mb-4">
      {/* Instruction line */}
      <p className="text-muted small mb-2">
        Please use the bank details below to transfer your payment via <strong>NEFT</strong> or <strong>RTGS</strong>.
      </p>

      {/* Card container */}
      <div className="card">
        <ul className="list-group list-group-flush">
          {Object.entries(BANK_DETAILS).map(([label, value], index) => (
            <li key={label} className="list-group-item d-flex justify-content-between align-items-center">
              <span className="text-capitalize">{label}</span>
              <div className="d-flex align-items-center gap-2">
                <strong className="me-2">{value}</strong>
                <button
                  type="button"
                  onClick={() => copyToClipboard(value, label)}
                  className="btn btn-link btn-sm p-0"
                >
                  {copiedField === label ? "Copied" : "Copy"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BankTransferDetails;
