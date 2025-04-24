import React from "react";
import { Routes, Route } from "react-router-dom";

// import AdminRoutes from './routes/AdminRoutes'
import LoginPage from "./pages/LoginPage";
import AdminPrivateRoutes from "../ProtectedRoutes/AdminPrivateRoutes";
// Layouts with Routes inside
import AdminLayout from "./layouts/AdminLayout";
// import ClientLayout from "./layouts/ClientLayout";
// import AdvisorLayout from "./layouts/AdvisorLayout";

const App = () => {
  return (

    <Routes>
      <Route
        path="/adminautharized/*"
        element={
          <AdminPrivateRoutes>
            <AdminLayout />
          </AdminPrivateRoutes>
        }
      />




      <Route path="login" element={<LoginPage />} />
    </Routes>

  );
};

export default App;
