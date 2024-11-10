// src/components/Layout/Layout.js
import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/NavBar/Navbar";
import "./Layout.css";

const Layout = ({ children }) => {

  const [breadcrumbs, setBreadcrumbs] = useState([{ name: "", path: "/" }]);
  const location = useLocation(); // useLocation is safe here

  useEffect(() => {
    // Map of path segments to breadcrumb labels
    const breadcrumbMap = {
      "/": "Home",
      "/posts": "Search",
      "/create": "Create Animal Profile",
      "/profile": "Profile",
      "/login": "Login",
    };

    const pathSegments = location.pathname.split("/").filter((segment) => segment);
    const newBreadcrumbs = []
    if (pathSegments.length > 0) {
    
      newBreadcrumbs.push({ name: "Home", path: "/" });

      pathSegments.forEach((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

        if (breadcrumbMap[path]) {
          newBreadcrumbs.push({ name: breadcrumbMap[path], path });
        } else if (segment) {
          // If path is dynamic (e.g., post ID), add custom breadcrumb text
          newBreadcrumbs.push({ name: "Post Details", path });
        }
      });
    
    }

    setBreadcrumbs(newBreadcrumbs);
  }, [location]);
  

  return (
    <>
      <Sidebar />
      <div className="main">
        <Navbar breadcrumbs={breadcrumbs}/>

        <div className="main-container">{children}</div>
      </div>
    </>
  );
};

export default Layout;
