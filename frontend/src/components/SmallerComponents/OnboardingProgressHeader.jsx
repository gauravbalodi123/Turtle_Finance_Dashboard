// OnboardingProgressHeader.jsx
import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { FiClock } from "react-icons/fi";


const OnboardingProgressHeader = ({ progressIndex, steps }) => {
  const percentComplete = Math.round((progressIndex / (steps.length - 1)) * 100);

  const timeEstimates = ["3-5 minutes", "2-3 minutes", "3-4 minutes", "2-3 minutes","1-2 minutes",];

  return (
    <div className="container-fluid bg-white p-4 mb-4 border border-secondary border-opacity-25 border-2 rounded-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h5 className="fw-bold m-0">{steps[progressIndex]?.title}</h5>
          <small className="text-muted">Understand your risk tolerance and investment preferences</small>
        </div>
        <div className="text-end">
          <div className="text-success fw-semibold">{percentComplete}% Complete</div>
          {/* <small className="text-muted">⏱️ {timeEstimates[progressIndex]}</small> */}
          <p className="card-subtitle text-muted mb-2">
            <FiClock style={{ marginRight: "4px" }} />  {timeEstimates[progressIndex]}
          </p>
        </div>
      </div>

      <ProgressBar now={percentComplete} className="mb-4 " style={{ height: "6px" }} />

      <div className="d-flex justify-content-around">
        {steps.map((step, index) => {
          const isActive = index === progressIndex;
          return (
            <div key={step.id} className="text-center" style={{ minWidth: "80px" }}>
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1`}
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: isActive ? "#0dd3a8" : "#dee2e6",
                  color: isActive ? "white" : "#333",
                  fontWeight: "bold"
                }}
              >
                {index + 1}
              </div>
              <small className={`d-block ${isActive ? "fw-bold text-dark" : "text-muted"}`}>
                {step.title}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgressHeader;
