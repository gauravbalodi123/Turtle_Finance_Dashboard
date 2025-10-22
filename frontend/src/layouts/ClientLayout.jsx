// src/layouts/ClientLayout.jsx
import React, { useRef, useState } from "react";
import Sidebar from "../components/MainNavigation/Client/ClientSidebar";
import Navbar from "../components/MainNavigation/Client/ClientNavbar";
import ClientRoutes from "../routes/ClientRoutes";
import styles from "../styles/ClientLayout/ClientLayout.module.css";

const ClientLayout = () => {
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
          className={`${styles.contentArea} ${
            isSidebarOpen ? styles.contentAreaMdOpen : styles.contentAreaMdHide
          }`}
        >
          <ClientRoutes />
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
