import React from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { FiUsers, FiLogOut, FiBookOpen } from "react-icons/fi";
import { VscCalendar } from "react-icons/vsc";
import { FaListOl, FaBars } from "react-icons/fa";
import brandlogo from "../../assets/images/logo_png.png";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/Sidebar/Sidebar.module.css";
import { BsPersonCheckFill } from "react-icons/bs";
import { LuActivity } from "react-icons/lu";
import { FaDollarSign } from 'react-icons/fa';

const Sidebar = ({ sidebarRef, isSidebarOpen, toggleSidebar, backdrop, scroll }) => {
  const location = useLocation();
  const basePath = "/adminautharized";

  return (
    <aside
      ref={sidebarRef}
      className={`offcanvas offcanvas-sm offcanvas-md offcanvas-start border-end ${isSidebarOpen ? "show " : ""} ${styles.sidebar}`}
      tabIndex="-1"
      id="customSidebar"
      data-bs-backdrop="false"
      data-bs-scroll="true"
    >

      {/* Header Logo */}
      <div className={styles.sidebarHeader}>
        <div className={`${styles.logoContainer}`}>
          <img
            src={brandlogo}
            alt="Brand Logo"
            className={`${styles.logo} ${isSidebarOpen ? "d-inline-block" : "d-none"} `}
          />
          <span className={` ${styles.toggleSidebarButton} fs-5 text-secondary  ${isSidebarOpen ? "" : "d-flex  align-items-center justify-content-center w-100 p-2 "}`} onClick={toggleSidebar}>
            <FaBars className={styles.icon} />
          </span>
        </div>
      </div>

      {/* Links */}
      <div className={`w-100 px-2 py-3 ${styles.navItemsContainer}`}>
        <Link to={`${basePath}/admin/clients`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"}  ${location.pathname === `${basePath}/admin/clients` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Clients</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/advisors`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/advisors` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <FiUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Advisors</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/memberActivation`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/memberActivation` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <LuActivity className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Member Activation</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/tasks`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/tasks` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <VscCalendar className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Meetings</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/rowwisetasks`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/rowwisetasks` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <FaListOl className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Tasks</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/bookings`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/bookings` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <FiBookOpen className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Bookings</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/prospects`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/prospects` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <BsPersonCheckFill className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Prospects</span>
          </div>
        </Link>
        <Link
        to={`${basePath}/admin/updateSubscriptionPrice`}
        className={`${styles.navLinks} ${isSidebarOpen
            ? "d-flex align-items-center w-100 p-2 mb-2"
            : "d-flex align-items-center justify-content-center w-100 p-2 mb-2"
          } ${location.pathname === `${basePath}/admin/updateSubscriptionPrice`
            ? styles.active
            : ""
          }`}
      >
        <div className={styles.navLinksIcons}>
          <FaDollarSign className={`${isSidebarOpen ? "me-3" : ""}`} />
          <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>
            Update Subscription Price
          </span>
        </div>
      </Link>
      </div>



      {/* Footer */}
      {/* <div className={`mt-auto p-2 d-flex align-items-center ${styles.footerContainer}`}>
        <Link to="/logout" className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 " : "d-flex  align-items-center justify-content-center w-100 p-2 "}`}>
          <div className={styles.navLinksIcons}>
            <FiLogOut className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Log Out</span>
          </div>
        </Link>
      </div> */}



    </aside >
  );
};

export default Sidebar;
