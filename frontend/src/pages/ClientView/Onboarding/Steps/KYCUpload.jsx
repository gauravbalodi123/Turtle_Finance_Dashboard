import React, { useState, useEffect } from "react";
import logo from "@assets/images/logo_png.png";
import axios from "axios";
import { BsUpload, BsFileEarmarkText, BsInfoCircle } from "react-icons/bs";

const url = import.meta.env.VITE_URL;

const KYCUpload = ({ onNext, onPrev, updateData, data }) => {
  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const checkKYC = async () => {
      try {
        const response = await axiosInstance.get("/client/kycData");
        if (response.status === 200) {
          console.log("KYC already submitted");
          onNext(); // ✅ auto move to next section if already uploaded
        }
      } catch (err) {
        console.log("No valid KYC found or expired:", err.response?.data?.msg || err.message);
      }
    };
    checkKYC();
  }, []);

  const handleSubmit = async () => {
    if (!aadhar || !pan) {
      alert("Please upload both Aadhaar and PAN documents.");
      return;
    }

    setLoading(true);
    try {
      const aadhaarForm = new FormData();
      aadhaarForm.append("aadhaar", aadhar);
      await axiosInstance.post("/client/aadhaar", aadhaarForm);

      const panForm = new FormData();
      panForm.append("pan", pan);
      await axiosInstance.post("/client/pan", panForm);

      // alert("KYC documents uploaded successfully.");
      onNext();
    } catch (error) {
      console.error("KYC upload error:", error.response?.data || error.message);
      // alert("Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 px-3 px-md-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">KYC Documents</h2>
        <p className="text-muted fs-6">
          Please upload clear, readable copies of your PAN Card and Aadhaar Card for identity verification
        </p>
      </div>

      <div className="row justify-content-center mb-4 g-4">
        {/* PAN Card Upload */}
        <div className="col-md-5">
          <div
            className={`border rounded-3 p-4 text-center h-100 ${pan ? "border-success border-2" : "border-dashed"}`}
            style={{ borderStyle: "dashed" }}
          >
            <div className="text-success mb-2">
              <BsFileEarmarkText size={32} />
            </div>
            <h5 className="fw-semibold">PAN Card</h5>
            <label
              htmlFor="panUpload"
              className="d-block mt-3 border rounded border-secondary-subtle p-3 cursor-pointer text-muted"
              style={{ cursor: "pointer" }}
            >
              <BsUpload className="me-2" />
              Click to upload <br />
              <small className="d-block mt-1 text-muted">JPG, PNG or PDF (max 5MB)</small>
            </label>

            <input
              type="file"
              id="panUpload"
              accept=".pdf,image/*"
              onChange={(e) => setPan(e.target.files[0])}
              className="d-none"
            />

            {pan && (
              <div className="mt-3 d-flex flex-column align-items-center">

                {/* ✅ Success Message */}
                <strong className="text-success mb-2">File uploaded successfully!</strong>

                {/* ✅ Preview + File Info & Remove */}
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div>
                    {pan.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(pan)}
                        alt="PAN Preview"
                        className="rounded-circle border border-2"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="d-inline-block text-muted small">
                        <BsFileEarmarkText className="me-1" />
                        {pan.name}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setPan(null)}
                    className="btn btn-sm btn-link text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Aadhaar Card Upload */}
        <div className="col-md-5">
          <div
            className={`border rounded-3 p-4 text-center h-100 ${aadhar ? "border-success border-2" : "border-dashed"}`}
            style={{ borderStyle: "dashed" }}
          >
            <div className="text-success mb-2">
              <BsFileEarmarkText size={32} />
            </div>
            <h5 className="fw-semibold">Aadhaar Card</h5>
            <label
              htmlFor="aadhaarUpload"
              className="d-block mt-3 border rounded border-secondary-subtle p-3 cursor-pointer text-muted"
              style={{ cursor: "pointer" }}
            >
              <BsUpload className="me-2" />
              Click to upload <br />
              <small className="d-block mt-1 text-muted">JPG, PNG or PDF (max 5MB)</small>
            </label>

            <input
              type="file"
              id="aadhaarUpload"
              accept=".pdf,image/*"
              onChange={(e) => setAadhar(e.target.files[0])}
              className="d-none"
            />

            {aadhar && (
              <div className="mt-3 d-flex flex-column align-items-center">


                <strong className="text-success mb-2">File uploaded successfully!</strong>


                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div>
                    {aadhar.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(aadhar)}
                        alt="Aadhaar Preview"
                        className="rounded-circle border border-2"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="d-inline-block text-muted small">
                        <BsFileEarmarkText className="me-1" />
                        {aadhar.name}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setAadhar(null)}
                    className="btn btn-sm btn-link text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>

      {/* Guidelines Box */}
      <div className="bg-light border border-success-subtle rounded p-4 mb-4" style={{ maxWidth: "800px", margin: "auto" }}>
        <div className="d-flex align-items-start">
          <BsInfoCircle className="me-2 text-success mt-1" size={20} />
          <div>
            <strong>Important Guidelines</strong>
            <ul className="mt-2 ps-3 small text-muted">
              <li>Ensure documents are clear and all text is readable</li>
              <li>Upload the front side of both documents</li>
              <li>File size should not exceed 5MB</li>
              <li>Accepted formats: JPG, PNG, PDF</li>
              <li>Documents should not be expired</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary px-4 py-2 fs-6 fw-medium shadow-sm"
          onClick={onPrev}
        >
          ← Back
        </button>

        <button
          onClick={handleSubmit}
          className="btn btn-success px-4 py-2 fs-5 fw-medium shadow-sm"
          disabled={!aadhar || !pan || loading}
        >
          {loading ? "Uploading..." : "Continue to Agreement Sign"}
        </button>
      </div>
    </div>
  );
};

export default KYCUpload;
