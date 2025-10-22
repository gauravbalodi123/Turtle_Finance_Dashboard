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

      
    </div>
  );
};

export default QRCodeAndUPI;
