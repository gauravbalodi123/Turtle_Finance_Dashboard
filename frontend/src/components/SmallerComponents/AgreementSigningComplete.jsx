import React from "react";
import { BsCheckCircle } from "react-icons/bs";

const AgreementSigningComplete = ({ onNext }) => {
    
    return (
        <div className="container-fluid p-0">
            <div className="bg-white border rounded shadow-sm p-4 text-center">
                <div className="mb-4">
                    <BsCheckCircle className="text-success" size={64} />
                </div>
                <h4 className="fw-bold mb-3">Agreement Signing Complete!</h4>
                <p className="text-muted mb-4">
                
                    You have successfully signed the agreement. You can now proceed to the next step .
                </p>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-success px-4" onClick={onNext}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgreementSigningComplete;
