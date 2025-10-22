import React from "react";
import { Routes, Route } from "react-router-dom";
import AllAdvisors from "../pages/ClientView/Advisors/AllAdvisors";


const ClientRoutes = () => {
  return (
    <Routes>

      <Route path="/client/advisors" element={<AllAdvisors />} />



      {/* to be called inside app.jsx direcly bcs they dont need client layouts sidebar and navbar */}
      {/* <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route path="/book-call" element={<CalendlyBooking />} /> */}
      
    </Routes>
  );
};

export default ClientRoutes;
