// src/layouts/AdvisorLayout.jsx
import React, { useRef, useState } from "react";
import Sidebar from "../components/MainNavigation/Advisor/AdvisorSidebar";
import Navbar from "../components/MainNavigation/Advisor/AdvisorNavbar";
import AdvisorRoutes from "../routes/AdvisorRoutes";
import styles from "../styles/AdvisorLayout/AdvisorLayout.module.css";

const AdvisorLayout = () => {
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
          <AdvisorRoutes />
        </div>
      </div>
    </div>
  );
};

export default AdvisorLayout;
