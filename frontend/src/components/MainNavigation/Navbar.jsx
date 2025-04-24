import React from "react";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import SearchFilter from "../SmallerComponents/SearchFilter";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Navbar = ({ isSidebarOpen, toggleSidebar, navbarSmallscreen, navbarmdscreenShow, navbarmdscreenHide }) => {
  
  axios.defaults.withCredentials = true;
  const url = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${url}/auth/logout`);
      navigate("/login", { state: { message: "You have been successfully logged out." } });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  


  return (
    <nav className={`navbar navbar-light px-4 bg-turtle ${navbarSmallscreen} ${isSidebarOpen ? navbarmdscreenShow : navbarmdscreenHide}`} data-bs-theme="light">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">

        {/* Sidebar toggle and brand */}
        <a onClick={toggleSidebar} className="navbar-brand cursor-pointer" aria-label="Toggle sidebar">
          Turtle Finance
        </a>

        {/* Profile dropdown */}
        <div className="dropdown me-3 gap-2 d-flex align-items-center justify-content-between g-3 ">

          <SearchFilter className=""></SearchFilter>

          <button className="btn p-2  rounded-circle btn-outline-turtle-secondary">
            <GoBell className="d-block fs-5" />
          </button>

          <button
            className="btn p-2  rounded-circle btn-outline-turtle-secondary "
            href="#"
            data-bs-toggle="dropdown"
          >
            <IoPersonOutline className="d-block fs-5" />
          </button>

          <ul className="dropdown-menu dropdown-menu-end mt-2">
            <li className={`d-flex align-items-center justify-content-start dropdown-item`}>
              <div className="">
                <span className="fs-5 m-0 p-0">
                  <IoPerson />
                </span>
                <a className=" text-decoration-none text-dark ms-2" href="#action/1">View Profile</a>
              </div>
            </li>

            <li><hr className="dropdown-divider" /></li>

            <li className={`d-flex align-items-center justify-content-start dropdown-item`} onClick={handleLogout} role="button">
              <div>
                <span><IoMdLogOut className="fs-4 text-danger" /></span>
                <span className="text-decoration-none text-dark ms-2">Log Out</span>
              </div>
            </li>


          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
