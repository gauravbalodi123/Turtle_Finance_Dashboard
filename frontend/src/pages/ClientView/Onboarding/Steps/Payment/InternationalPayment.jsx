// src/pages/ClientView/Payment/InternationalPayment.jsx
import React from "react";

const RAZORPAY_URL = "https://pages.razorpay.com/pl_QVqdshsEY7fnwy/view";

const InternationalPayment = () => {
  const openRazorpay = () => {
    window.open(RAZORPAY_URL, "_blank");
  };

  return (
    <div className="text-center">
      <h3 className="h5 fw-semibold mb-3">Pay via Razorpay</h3>
      <p className="text-secondary mb-4">
        For international payments, we use Razorpay which accepts all major
        credit cards, debit cards, and other payment methods.
      </p>
      <button
        onClick={openRazorpay}
        className="btn btn-primary px-4 py-2"
      >
        Make Payment
      </button>
    </div>
  );
};

export default InternationalPayment;
