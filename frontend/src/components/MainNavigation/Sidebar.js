import React from "react";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { BsPersonPlus } from "react-icons/bs";
import { VscTasklist ,VscCalendar} from "react-icons/vsc";
import { FiLogOut } from "react-icons/fi";
import brandlogo from "../../assets/images/logo_brandreverse.png";
import { Link, useLocation } from "react-router-dom";
import styles from '../../styles/Sidebar/Sidebar.module.css';

const Sidebar = ({ isVisible, onToggleSidebar }) => {
  const location = useLocation();

  return (
    <>

      <aside className={styles.sidebar}>
        {/* Header Logo */}
        <div className={`${styles.sidebarHeader} `}>
          <div className={styles.logoContainer}>
            <img
              src={brandlogo}
              alt="Brand Logo"
              className={`${styles.logo}`}
            />
            <FiLogOut className={`${styles.icon}`} />
          </div>
          
        </div>

        {/* Navigation Links Container */}
        <div className={`w-100 px-2 py-3 ${styles.navItemsContainer}`}>
          {/* <Link
            to="/dashboard"
            className={`${styles.navLinks} d-flex align-items-center w-100 p-2 mb-2  ${location.pathname === '/dashboard' ? styles.active : ''}`}
          >
            <div className={styles.navLinksIcons}>
              <RiDashboardLine className="me-3" />
              <span>Dashboard</span>
            </div>
          </Link> */}

          <Link
            to="/clients"
            className={`${styles.navLinks} d-flex align-items-center w-100 p-2 mb-2  ${location.pathname === '/clients' ? styles.active : ''}`}
          >
            <div className={styles.navLinksIcons}>
              <HiOutlineUsers className="me-3" />
              <span>Clients</span>
            </div>
          </Link>

          <Link
            to="/advisors"
            className={`${styles.navLinks} d-flex align-items-center w-100 p-2 mb-2  ${location.pathname === '/advisors' ? styles.active : ''}`}
          >
            <div className={styles.navLinksIcons}>
              <FiUsers className="me-3" />
              <span>Advisors</span>
            </div>
          </Link>

          {/* <Link
            to="/client-activation"
            className={`${styles.navLinks} d-flex align-items-center w-100 p-2 mb-2  ${location.pathname === '/client-activation' ? styles.active : ''}`}
          >
            <div className={styles.navLinksIcons}>
              <BsPersonPlus className="me-3" />
              <span>Client Activation</span>
            </div>
          </Link> */}

          <Link
            to="tasks"
            className={`${styles.navLinks} d-flex align-items-center w-100 p-2 mb-2  ${location.pathname === '/tasks' ? styles.active : ''}`}
          >
            <div className={styles.navLinksIcons}>
            <VscCalendar className="me-3" />
              <span>Meetings</span>
            </div>
          </Link>

          <Link
            to="rowwisetasks"
            className={`${styles.navLinks} d-flex align-items-center w-100 p-2 mb-2  ${location.pathname === '/rowwisetasks' ? styles.active : ''}`}
          >
            <div className={styles.navLinksIcons}>
              <VscTasklist className="me-3" />
              <span>Tasks</span>
            </div>
          </Link>
        </div>

        {/* Logout at bottom */}
        <div className={`mt-auto p-2 d-flex align-items-center ${styles.footerContainer}`}>
          <Link
            to="/logout"
            className={`${styles.navLinks} d-flex align-items-center w-100 p-2 `}
          >
            <div className={styles.navLinksIcons}>
              <FiLogOut className="me-3" />
              <span>Log Out</span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
