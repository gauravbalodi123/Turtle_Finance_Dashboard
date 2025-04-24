import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Add Navigate here

import LoginPage from "./pages/LoginPage";
import AdminPrivateRoutes from "../ProtectedRoutes/AdminPrivateRoutes";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  return (
    <Routes>
      {/* Redirect from root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/adminautharized/*"
        element={
          <AdminPrivateRoutes>
            <AdminLayout />
          </AdminPrivateRoutes>
        }
      />
    </Routes>
  );
};

export default App;
