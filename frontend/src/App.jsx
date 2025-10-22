import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";


import AdminPrivateRoutes from "../ProtectedRoutes/AdminPrivateRoutes";
import ClientPrivateRoute from "../ProtectedRoutes/ClientPrivateRoutes";
import AdvisorPrivateRoute from "../ProtectedRoutes/AdvisorPrivateRoutes";


import AdminLayout from "./layouts/AdminLayout";
import AdvisorLayout from "./layouts/AdvisorLayout";
import ClientLayout from "./layouts/ClientLayout";

import OnboardingFlow from "./pages/ClientView/Onboarding/OnboardingFlow";
import CalendlyBooking from "./components/SmallerComponents/CalendlyBooking";

const App = () => {
  return (
    <Routes>
      {/* Redirect from root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login Route */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Protected Routes */}
      <Route
        path="/adminautharized/*"
        element={
          <AdminPrivateRoutes>
            <AdminLayout />
          </AdminPrivateRoutes>
        }
      />

      <Route
        path="/clientautharized/onboarding"
        element={
          <ClientPrivateRoute>
            <OnboardingFlow />
          </ClientPrivateRoute>
        }
      />
      <Route
        path="/clientautharized/book-call"
        element={
          <ClientPrivateRoute>
            <CalendlyBooking />
          </ClientPrivateRoute>
        }
      />

      {/* Client Protected Routes */}
      <Route
        path="/clientautharized/*"
        element={
          <ClientPrivateRoute>
            <ClientLayout />
          </ClientPrivateRoute>
        }
      />

      <Route
        path="/advisorautharized/*"
        element={
          <AdvisorPrivateRoute>
            <AdvisorLayout />
          </AdvisorPrivateRoute>
        }
      />



    </Routes>
  );
};

export default App;
