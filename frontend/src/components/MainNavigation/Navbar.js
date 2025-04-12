import React from "react";
import { FaChevronRight } from "react-icons/fa";
import styles from '../../styles/Navbar/Navbar.module.css';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-turtle fixed-top px-4" data-bs-theme="light">
        <div className="container-fluid p-0">

          {/* Mobile sidebar toggle button */}
          <div className="d-sm-flex align-items-center">
            <button
              className="d-md-none btn btn-link text-dark border-0 p-0 me-3"
              onClick={onToggleSidebar}
              type="button"
              aria-label="Toggle sidebar"
            >
              <FaChevronRight size={24} />
            </button>
            <a className="navbar-brand" href="#home">Turtle Finance</a>
          </div>

          {/* Collapsible navbar toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#basic-navbar-nav"
            aria-controls="basic-navbar-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar content */}
          <div className="collapse navbar-collapse" id="basic-navbar-nav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#link">Link</a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle profile-dropdown"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  id="profile-nav-dropdown"
                >
                  Profile
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#action/3.1">Action</a></li>
                  <li><a className="dropdown-item" href="#action/3.2">Another action</a></li>
                  <li><a className="dropdown-item" href="#action/3.3">Something</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#action/3.4">Separated link</a></li>
                </ul>
              </li>
            </ul>
          </div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;
