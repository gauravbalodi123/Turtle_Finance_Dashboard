// src/pages/ClientView/Payment/QRCodeAndUPI.jsx
import React from "react";

import qrCodeImage from "@assets/images/qr-code.jpg"; // adjust alias if needed // make sure this exists in public/images
const UPI_ID = "turtle.ml@axl";

const QRCodeAndUPI = () => {
  return (
    <div className="text-center space-y-4">
      {/* QR Code */}
      <div className="flex justify-center">
        <img
          src={qrCodeImage}
          alt="Payment QR Code"
          className="w-100 h-100 object-contain rounded-lg shadow-md"
        />
      </div>

      {/* Scan Text */}
      <p className="text-gray-600 text-base">Scan to pay via UPI</p>

      {/* UPI ID */}
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Or use UPI ID</p>
        <p className="text-lg font-semibold text-blue-700">{UPI_ID}</p>
      </div>
    </div>
  );
};

export default QRCodeAndUPI;
