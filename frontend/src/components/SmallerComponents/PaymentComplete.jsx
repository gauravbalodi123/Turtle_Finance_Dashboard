import React from "react";
import { BsCheckCircle } from "react-icons/bs";

const PaymentComplete = ({ onNext }) => {
    return (
        <div className="container-fluid p-0">
            <div className="bg-white border rounded shadow-sm p-4 text-center">
                <div className="mb-4">
                    <BsCheckCircle className="text-success" size={64} />
                </div>
                <h4 className="fw-bold mb-3">Onboarding Completed!</h4>
                <p className="text-muted mb-4">
                    Welcome Onboard!
                    We will now review and confirm the transaction and share the invoice.
                    <br />
                    <strong>As the final step</strong>, please book your kick-off call so we can get started:
                </p>

                <div className="d-flex justify-content-center gap-3">
                    <button
                        className="btn btn-success px-4"
                        onClick={onNext}
                    >
                        Book Kick-Off Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentComplete;
