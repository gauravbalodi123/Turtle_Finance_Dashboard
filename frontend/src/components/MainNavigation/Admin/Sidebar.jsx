import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useLocation, Link } from "react-router-dom";
import styles from "../../../styles/MainNavigations/AdminNavigation/Sidebar.module.css";
import { FaBars, FaListOl, FaDollarSign, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { BsPersonCheckFill } from "react-icons/bs";
import { LuActivity } from "react-icons/lu";
import { BiLogoGmail } from "react-icons/bi";
import { VscCalendar } from "react-icons/vsc";
import brandlogo from "../../../assets/images/logo_png.png";

const Sidebar = ({
  sidebarRef,
  isSidebarOpen,
  toggleSidebar,
  backdrop = false,
  scroll = true,
}) => {
  const location = useLocation();
  const basePath = "/adminautharized";

  // here im simply detcing small screens
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Offcanvas
      ref={sidebarRef}
      show={isSidebarOpen}
      onHide={toggleSidebar}
      responsive="md"
      scroll={scroll}
      /** and Only use static backdrop on small screens */
      backdrop={isSmallScreen ? "static" : false}
      placement="start"
      className={`offcanvas offcanvas-sm offcanvas-md offcanvas-start border-end ${styles.sidebar} ${isSidebarOpen ? "show" : ""}`}
    >
      {/* header */}
      <div className={styles.sidebarHeader} style={{ width: "100%" }}>
        <div
          className={`${styles.logoContainer} ${isSidebarOpen ? "justify-content-between" : "justify-content-center"
            }`}
        >
          <img
            src={brandlogo}
            alt="Brand Logo"
            className={`${styles.logo} ${isSidebarOpen ? "d-inline-block" : "d-none"
              }`}
          />
          <button
            type="button"
            className={`btn btn-sm ${styles.toggleSidebarButton}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars className={styles.icon} />
          </button>
        </div>
      </div>

      {/* links */}
      <div className={`w-100 px-2 py-3 ${styles.navItemsContainer}`}>

        <Link to={`${basePath}/admin/clients`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"}  ${location.pathname === `${basePath}/admin/clients` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Clients</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/prospects`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/prospects` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <BsPersonCheckFill className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Prospects</span>
          </div>
        </Link>
        <Link to={`${basePath}/admin/emailTracker`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"}  ${location.pathname === `${basePath}/admin/emailTracker` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Email Tracker</span>
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
            <FaPhoneAlt className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Bookings</span>
          </div>
        </Link>
        {/* <Link to={`${basePath}/admin/processedbookings`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/processedbookings` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <FaPhoneAlt className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Upcoming Bookings</span>
          </div>
        </Link> */}

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






        {/* (keep rest of links same as before) */}
      </div>
    </Offcanvas>
  );
};

export default Sidebar;







// <Link to={`${basePath}/admin/clients`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"}  ${location.pathname === `${basePath}/admin/clients` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Clients</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/admin/prospects`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/prospects` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <BsPersonCheckFill className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Prospects</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/admin/emailTracker`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"}  ${location.pathname === `${basePath}/admin/emailTracker` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Email Tracker</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/admin/advisors`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/advisors` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <FiUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Advisors</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/admin/memberActivation`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/memberActivation` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <LuActivity className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Member Activation</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/admin/tasks`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/tasks` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <VscCalendar className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Meetings</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/admin/rowwisetasks`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/rowwisetasks` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <FaListOl className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Tasks</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/admin/bookings`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/bookings` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <FaPhoneAlt className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Bookings</span>
//             </div>
//           </Link>
// {/* <Link to={`${basePath}/admin/processedbookings`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 p-2 mb-2" : "d-flex  align-items-center justify-content-center w-100 p-2 mb-2"} ${location.pathname === `${basePath}/admin/processedbookings` ? styles.active : ""}`}>
//           <div className={styles.navLinksIcons}>
//             <FaPhoneAlt className={` ${isSidebarOpen ? "me-3" : ""}`} />
//             <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Upcoming Bookings</span>
//           </div>
//         </Link> */}

// <Link
//   to={`${basePath}/admin/updateSubscriptionPrice`}
//   className={`${styles.navLinks} ${isSidebarOpen
//     ? "d-flex align-items-center w-100 p-2 mb-2"
//     : "d-flex align-items-center justify-content-center w-100 p-2 mb-2"
//     } ${location.pathname === `${basePath}/admin/updateSubscriptionPrice`
//       ? styles.active
//       : ""
//     }`}
// >
//   <div className={styles.navLinksIcons}>
//     <FaDollarSign className={`${isSidebarOpen ? "me-3" : ""}`} />
//     <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>
//       Update Subscription Price
//     </span>
//   </div>
// </Link>





