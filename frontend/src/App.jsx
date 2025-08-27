import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";


import AdminPrivateRoutes from "../ProtectedRoutes/AdminPrivateRoutes";
import ClientPrivateRoute from "../ProtectedRoutes/ClientPrivateRoutes";
import AdminLayout from "./layouts/AdminLayout";
import ClientRoutes from "./routes/ClientRoutes"; // ✅ Updated to use ClientRoutes instead of ClientLayout

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

      {/* Client Protected Routes */}
      <Route
        path="/clientautharized/*"
        element={
          <ClientPrivateRoute>
            <ClientRoutes /> {/* ✅ Now renders your new Risk Profile Flow */}
          </ClientPrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
