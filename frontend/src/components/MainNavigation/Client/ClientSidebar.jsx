import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useLocation, Link } from "react-router-dom";
import styles from "../../../styles/MainNavigations/ClientNavigation/Sidebar.module.css";
import { FaBars } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import brandlogo from "../../../assets/images/logo_png.png";
import { GrSchedulePlay } from "react-icons/gr";
import { FaRegMessage } from "react-icons/fa6";

const Sidebar = ({
  sidebarRef,
  isSidebarOpen,
  toggleSidebar,
  backdrop = false,
  scroll = true,
}) => {
  const location = useLocation();
  const basePath = "/clientautharized";

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
      <div className={`w-100 px-3 py-3 ${styles.navItemsContainer}`}>

        <Link to={`${basePath}/client/advisors`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"}  ${location.pathname === `${basePath}/client/advisors` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Dashboard</span>
          </div>
        </Link>
        <Link to={`${basePath}/client/discussionNotes`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/discussionNotes` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <FaRegMessage className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Discussion Notes</span>
          </div>
        </Link>
        <Link to={`${basePath}/client/membership`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"}  ${location.pathname === `${basePath}/client/membership` ? styles.active : ""}`}>
          <div className={styles.navLinksIcons}>
            <GrSchedulePlay className={` ${isSidebarOpen ? "me-3" : ""}`} />
            <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >My Membership</span>
          </div>
        </Link>


      </div>
    </Offcanvas>
  );
};

export default Sidebar;







// <Link to={`${basePath}/client/clients`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"}  ${location.pathname === `${basePath}/client/clients` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Clients</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/client/meetingNotes`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/meetingNotes` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <BsPersonCheckFill className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>meetingNotes</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/client/bookings`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"}  ${location.pathname === `${basePath}/client/bookings` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <HiOutlineUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`} >Email Tracker</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/client/clients`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/clients` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <FiUsers className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>clients</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/client/memberActivation`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/memberActivation` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <LuActivity className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Member Activation</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/client/tasks`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/tasks` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <VscCalendar className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Meetings</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/client/rowwisetasks`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/rowwisetasks` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <FaListOl className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Tasks</span>
//             </div>
//           </Link>
//           <Link to={`${basePath}/client/bookings`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/bookings` ? styles.active : ""}`}>
//             <div className={styles.navLinksIcons}>
//               <FaPhoneAlt className={` ${isSidebarOpen ? "me-3" : ""}`} />
//               <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Bookings</span>
//             </div>
//           </Link>
// {/* <Link to={`${basePath}/client/processedbookings`} className={`${styles.navLinks} ${isSidebarOpen ? "d-flex align-items-center w-100 px-2 py-3  mb-2" : "d-flex  align-items-center justify-content-center w-100 px-2 py-3  mb-2"} ${location.pathname === `${basePath}/client/processedbookings` ? styles.active : ""}`}>
//           <div className={styles.navLinksIcons}>
//             <FaPhoneAlt className={` ${isSidebarOpen ? "me-3" : ""}`} />
//             <span className={`${isSidebarOpen ? "d-inline-block" : "d-none"}`}>Upcoming Bookings</span>
//           </div>
//         </Link> */}

// <Link
//   to={`${basePath}/client/updateSubscriptionPrice`}
//   className={`${styles.navLinks} ${isSidebarOpen
//     ? "d-flex align-items-center w-100 px-2 py-3  mb-2"
//     : "d-flex align-items-center justify-content-center w-100 px-2 py-3  mb-2"
//     } ${location.pathname === `${basePath}/client/updateSubscriptionPrice`
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





