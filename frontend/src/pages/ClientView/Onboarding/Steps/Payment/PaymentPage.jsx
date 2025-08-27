import React, { useState, useEffect } from "react";
import QRCodeAndUPI from "./QRCodeAndUPI";
import BankTransferDetails from "./BankTransferDetails";
import InternationalPayment from "./InternationalPayment";
// import turtleLogo from "@assets/images/logo_png.png";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const PaymentPage = ({ onNext }) => {
  const [location, setLocation] = useState("india");
  const [method, setMethod] = useState("qr");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // ✅ Check payment status on first load
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(`${url}/client/payments/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.status === "completed") {
          setPaymentConfirmed(true);
        }
      } catch (error) {
        console.error(
          "Error checking payment status:",
          error.response?.data || error.message
        );
      }
    };

    checkPaymentStatus();
  }, []);

  // ✅ Auto-move to next step when payment confirmed
  useEffect(() => {
    if (paymentConfirmed) {
      onNext?.(); // only call if passed
    }
  }, [paymentConfirmed, onNext]);

  const handlePaymentConfirm = async () => {
    try {
      const response = await axios.post(
        `${url}/client/payments`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setPaymentConfirmed(true);
      } else {
        console.error("Payment not recorded:", response.data);
      }
    } catch (error) {
      console.error(
        "Axios error submitting payment:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center">
        {/* Header */}
        <div className="w-100 text-center mb-4 position-relative">
          <h1 className="h2 fw-bold text-primary mb-3">Complete Your Payment</h1>
          {/* <img
            src={turtleLogo}
            alt="Turtle Logo"
            className="position-absolute top-0 end-0 me-2"
            style={{ height: "40px", objectFit: "contain" }}
          /> */}
        </div>

        {/* Card */}
        <div className="card shadow w-100" style={{ maxWidth: "900px" }}>
          <div className="card-body">
            <div className="row g-4">
              {/* Left Column: Payment Option */}
              <div className="col-md-6">
                <h5 className="fw-semibold text-dark mb-3">Payment Option</h5>
                <div className="d-grid gap-3">
                  {/* India Option */}
                  <div
                    className={`border rounded p-3 d-flex align-items-center cursor-pointer ${location === "india"
                        ? "border-primary bg-light"
                        : "border-secondary"
                      }`}
                    onClick={() => setLocation("india")}
                  >
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${location === "india"
                          ? "bg-primary"
                          : "border border-secondary"
                        }`}
                      style={{ width: "20px", height: "20px" }}
                    >
                      {location === "india" && (
                        <div
                          className="bg-white rounded-circle"
                          style={{ width: "8px", height: "8px" }}
                        ></div>
                      )}
                    </div>
                    <span
                      className={`d-flex align-items-center gap-2 ${location === "india"
                          ? "text-primary fw-medium"
                          : "text-dark"
                        }`}
                    >
                      <span style={{ fontSize: "1.2rem" }}>₹</span> Paying from
                      India
                    </span>
                  </div>

                  {/* International Option */}
                  <div
                    className={`border rounded p-3 d-flex align-items-center cursor-pointer ${location === "international"
                        ? "border-primary bg-light"
                        : "border-secondary"
                      }`}
                    onClick={() => setLocation("international")}
                  >
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${location === "international"
                          ? "bg-primary"
                          : "border border-secondary"
                        }`}
                      style={{ width: "20px", height: "20px" }}
                    >
                      {location === "international" && (
                        <div
                          className="bg-white rounded-circle"
                          style={{ width: "8px", height: "8px" }}
                        ></div>
                      )}
                    </div>
                    <span
                      className={`d-flex align-items-center gap-2 ${location === "international"
                          ? "text-primary fw-medium"
                          : "text-dark"
                        }`}
                    >
                      <span style={{ fontSize: "1.2rem" }}>💳</span> Paying from
                      Outside India
                    </span>
                  </div>

                  {/* Confirm Button */}
                  <div className="pt-2 ps-4">
                    {!paymentConfirmed ? (
                      <button
                        onClick={handlePaymentConfirm}
                        className="btn btn-success px-4 rounded-pill fw-semibold"
                      >
                        I’ve Made the Payment
                      </button>
                    ) : (
                      <p className="text-success fw-medium mt-2 small">
                        ✅ Thank you for making the payment! We will verify and
                        get back to you.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <h5 className="fw-semibold text-dark mb-3">Payment Method</h5>
                {location === "india" && (
                  <>
                    <div className="d-flex border rounded mb-3 overflow-hidden">
                      <button
                        className={`btn flex-fill ${method === "qr"
                            ? "btn-outline-primary"
                            : "btn-light text-muted"
                          }`}
                        onClick={() => setMethod("qr")}
                      >
                        QR Code & UPI
                      </button>
                      <button
                        className={`btn flex-fill ${method === "bank"
                            ? "btn-outline-primary"
                            : "btn-light text-muted"
                          }`}
                        onClick={() => setMethod("bank")}
                      >
                        Bank Transfer
                      </button>
                    </div>

                    <div className="border p-3 rounded bg-white">
                      {method === "qr" ? (
                        <QRCodeAndUPI />
                      ) : (
                        <BankTransferDetails />
                      )}
                    </div>
                  </>
                )}
                {location === "international" && (
                  <div className="border p-3 rounded bg-white">
                    <InternationalPayment />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
