import React, { useState } from "react";
import Sidebar from "./components/MainNavigation/Sidebar";
import Navbar from "./components/MainNavigation/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

const App = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <div className={`sidebar-container  ${isSidebarVisible ? 'show' : ''}`}>
      <Sidebar isVisible={isSidebarVisible} onToggleSidebar={toggleSidebar} />

      </div>

      {/* Main content area */}
      <div className="main-content-wrapper">
        
        {/* Navbar */}
        <div className="navbar-container">
          <Navbar onToggleSidebar={toggleSidebar} />
        </div>

        {/* Content Area */}
        <div className="content-area">
          <AppRoutes />
        </div>
        
      </div>
    </div>
  );
};

export default App;
