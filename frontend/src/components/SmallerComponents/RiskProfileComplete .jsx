import React from "react";
import { BsCheckCircle } from "react-icons/bs";

const RiskProfileComplete = ({ onNext, onModify }) => {
  return (
    <div className="container-fluid p-0">
      <div className="bg-white border rounded shadow-sm p-4 text-center">
        <div className="mb-4">
          <BsCheckCircle className="text-success" size={64} />
        </div>
        <h4 className="fw-bold mb-3">Risk Profile Complete!</h4>
        <p className="text-muted mb-4">
          Based on your responses, we've determined your risk profile. You can now proceed to document upload.
        </p>

        {/* <div className="bg-light border rounded py-3 px-4 mb-4">
          <p className="mb-1">
            <strong>Your Risk Profile:</strong> Moderate Investor
          </p>
          <p className="text-success small mb-0">
            Suitable for balanced investment strategies with moderate risk exposure
          </p>
        </div> */}

        <div className="d-flex justify-content-center gap-3">
          {/* <button className="btn btn-dark" onClick={onModify}>
            Modify Responses
          </button> */}
          <button className="btn btn-success px-4" onClick={onNext}>
            Continue to KYC
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskProfileComplete;
