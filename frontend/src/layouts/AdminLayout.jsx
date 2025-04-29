import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/MainNavigation/Sidebar";
import Navbar from "../components/MainNavigation/Navbar";
import AdminRoutes from "../routes/AdminRoutes";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/AdminLayout/AdminLayout.css";

window.bootstrap = bootstrap;

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const offcanvasRef = useRef(null);

  useEffect(() => {
    const sidebarEl = sidebarRef.current;
    if (!sidebarEl) return;
  
    const instance = bootstrap.Offcanvas.getOrCreateInstance(sidebarEl);
    offcanvasRef.current = instance;
  
    const handleShow = () => setIsSidebarOpen(true);
    const handleHide = () => setIsSidebarOpen(false);
  
    sidebarEl.addEventListener("shown.bs.offcanvas", handleShow);
    sidebarEl.addEventListener("hidden.bs.offcanvas", handleHide);
  
    return () => {
      if (sidebarEl) {
        sidebarEl.removeEventListener("shown.bs.offcanvas", handleShow);
        sidebarEl.removeEventListener("hidden.bs.offcanvas", handleHide);
      }
    };
  }, []); // <== empty dependency so it runs ONCE only
  

  const toggleSidebar = () => {
    
    if (!offcanvasRef.current) {
      console.warn("⛔ Offcanvas not initialized yet");
      return;
    }

    if (isSidebarOpen) {
      offcanvasRef.current.hide();
    } else {
      offcanvasRef.current.show();
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar
        sidebarRef={sidebarRef}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="main-content-wrapper">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          navbarSmallscreen="navbarSmallscreen"
          navbarmdscreenShow="navbarmdscreenShow"
          navbarmdscreenHide="navbarmdscreenHide"
          contentArea="contentArea"
        />

        <div className={`content-area ${isSidebarOpen ? "contentAreaMdOpen" : "contentAreaMdHide"}`}>
          <AdminRoutes />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
