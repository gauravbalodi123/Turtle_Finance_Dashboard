import React from "react";
import { Navbar, Container, Button, Dropdown } from "react-bootstrap";
import { IoPersonOutline, IoPerson } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { GoBell } from "react-icons/go";
import SearchFilter from "../../SmallerComponents/SearchFilter";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../../../styles/MainNavigations/ClientNavigation/Navbar.module.css'

const NavbarComponent = ({
  isSidebarOpen,
  toggleSidebar,
  navbarSmallscreen,
  navbarmdscreenShow,
  navbarmdscreenHide,
}) => {
  axios.defaults.withCredentials = true;
  const url = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${url}/auth/logout`);
      navigate("/login", {
        state: { message: "You have been successfully logged out." },
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <Navbar
      bg="turtle"
      variant="light"
      expand={false}
      className={`px-4 ${navbarSmallscreen} ${isSidebarOpen ? navbarmdscreenShow : navbarmdscreenHide
        }`}
      data-bs-theme="light"
    >
      <Container fluid className="p-0 d-flex justify-content-between align-items-center">
        {/* Sidebar toggle and brand */}
        <Button
          variant="link"
          className="navbar-brand cursor-pointer p-0"
          onClick={toggleSidebar}
        >
          Turtle Finance
        </Button>

        {/* Right section */}
        <div className="me-3 gap-2 d-flex align-items-center justify-content-between g-3">
          <SearchFilter />

          {/* Notification button */}
          <Button variant="outline-turtle-secondary" className="p-2 rounded-circle">
            <GoBell className="d-block fs-5" />
          </Button>

          {/* Profile dropdown (React-Bootstrap) */}
          <div className={styles.navbarDropdown}>
            <Dropdown align="end">
              <Dropdown.Toggle
                as={Button}
                variant="outline-turtle-secondary"
                className="p-2 rounded-circle no-caret"
                style={{ background: "transparent" }}
              >
                <IoPersonOutline className="d-block fs-5" />
              </Dropdown.Toggle>


              <Dropdown.Menu className="mt-2">
                <Dropdown.Item className="d-flex align-items-center">
                  <IoPerson className="fs-5 me-2" />
                  <span>View Profile</span>
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item
                  as="div"
                  className="d-flex align-items-center"
                  onClick={handleLogout}
                  role="button"
                >
                  <IoMdLogOut className="fs-4 text-danger me-2" />
                  <span>Log Out</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
