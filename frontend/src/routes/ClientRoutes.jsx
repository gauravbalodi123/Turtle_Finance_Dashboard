import React from "react";
import { Routes, Route } from "react-router-dom";
// import RiskProfileForm from "@pages/ClientView/riskProfileForm";
// import AgreementSigning from "@pages/ClientView/AgreementSigning";
// import KYCUpload from "@pages/ClientView/KYCUpload";
import OnboardingFlow from "../pages/ClientView/Onboarding/OnboardingFlow";
import CalendlyBooking from "../components/SmallerComponents/CalendlyBooking";
// import PaymentPage from "@pages/ClientView/Payment/PaymentPage";
// import ClientAdvisorDashboard from "@pages/ClientView/clientAdvisorDashboard";

const ClientRoutes = () => {
  return (
    <Routes>
      {/* Direct Routes (if accessed individually) */}
      {/* <Route path="dashboard" element={<RiskProfileForm />} /> */}
      {/* <Route path="agreement" element={<AgreementSigning />} /> */}
      {/* <Route path="kyc" element={<KYCUpload />} /> */}
      {/* <Route path="payment" element={<PaymentPage />} /> */}
      {/* <Route path="clientAdvisorDashboard" element={<ClientAdvisorDashboard />} /> */}


      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route path="/book-call" element={<CalendlyBooking />} />
    </Routes>
  );
};

export default ClientRoutes;
