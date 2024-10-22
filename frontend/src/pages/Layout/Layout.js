// src/components/Layout/Layout.js
import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/NavBar/Navbar";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="main">
        <Navbar />

        <div className="main-container">{children}</div>
      </div>
    </>
  );
};

export default Layout;
