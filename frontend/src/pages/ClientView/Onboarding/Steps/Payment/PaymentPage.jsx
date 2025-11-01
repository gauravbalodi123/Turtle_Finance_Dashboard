import React, { useState, useEffect } from "react";
import QRCodeAndUPI from "./QRCodeAndUPI";
import BankTransferDetails from "./BankTransferDetails";
import InternationalPayment from "./InternationalPayment";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const PaymentPage = ({ onNext }) => {
  const [location, setLocation] = useState("india");
  const [method, setMethod] = useState("qr");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [price, setPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [showConfirmButton, setShowConfirmButton] = useState(false);




  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfirmButton(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);


  // ✅ Fetch plan price based on clientType from backend
  useEffect(() => {
    const fetchPlanPrice = async () => {
      try {
        setLoadingPrice(true);
        const res = await axios.get(`${url}/client/payments/plan`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data?.plan) {
          setPrice({
            rupees: res.data.plan.priceRupees,
            dollar: res.data.plan.priceDollar,
            planName: res.data.plan.planName, // store for later if needed
          });
        }
      } catch (error) {
        console.error("Error fetching plan price:", error.response?.data || error.message);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPlanPrice();
  }, []);

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
    <div className="min-vh-100 ">
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center">
        {/* Header */}
        <div className="w-100 text-center mb-4 position-relative">
          <h1 style={{ color: "rgb(13, 211, 168)" }} className="h2 fw-bold  mb-3">Complete Your Payment</h1>

          {loadingPrice ? (
            <p>Loading subscription charges...</p>
          ) : price ? (
            <p className="text-dark fw-semibold">
              The annual membership fee is{" "}
              <span
                style={{
                  color: "rgb(13, 211, 168)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {price.rupees}
              </span>
              {price.planName?.includes("NRI") && (
                <>
                  {" "}or{" "}
                  <span
                    style={{
                      color: "rgb(13, 211, 168)",

                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {price.dollar}
                  </span>
                </>
              )}
            </p>
          ) : (
            <p className="text-danger">Price not available</p>
          )}



        </div>

        {/* Card */}
        <div className="card shadow w-100 " style={{ maxWidth: "900px" }}>
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
                      <span style={{ fontSize: "1.2rem" }}>₹</span> Paying from India
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
                  {/* Confirm Button */}
                  <div className="pt-2 ps-4">
                    {!paymentConfirmed ? (
                      showConfirmButton ? (
                        <button
                          onClick={handlePaymentConfirm}
                          className="btn btn-success px-4 rounded-pill fw-semibold"
                        >
                          Click here after making the payment
                        </button>
                      ) : (
                        <p className="text-muted small">Loading payment confirmation...</p>
                      )
                    ) : (
                      <p className="text-success fw-medium mt-2 small">
                        ✅ Thank you for making the payment! We will verify and get back to you.
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
                      {method === "qr" ? <QRCodeAndUPI /> : <BankTransferDetails />}
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
