// src/layouts/AdminLayout.jsx
import React, { useRef, useState } from "react";
import Sidebar from "../components/MainNavigation/Admin/Sidebar";
import Navbar from "../components/MainNavigation/Admin/Navbar";
import AdminRoutes from "../routes/AdminRoutes";
import styles from "../styles/AdminLayout/AdminLayout.module.css"; // ✅ module import

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.appWrapper}>
      <Sidebar
        sidebarRef={sidebarRef}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        backdrop={false}
        scroll={true}
        closeSidebar={closeSidebar}
      />

      <div className={styles.mainContentWrapper}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          navbarSmallscreen={styles.navbarSmallscreen}
          navbarmdscreenShow={styles.navbarmdscreenShow}
          navbarmdscreenHide={styles.navbarmdscreenHide}
          contentArea={styles.contentArea}
        />

        <div
          className={`${styles.contentArea} ${isSidebarOpen ? styles.contentAreaMdOpen : styles.contentAreaMdHide
            }`}
        >
          <AdminRoutes />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
