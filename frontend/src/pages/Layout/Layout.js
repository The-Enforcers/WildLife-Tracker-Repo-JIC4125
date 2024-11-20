// src/components/Layout/Layout.js
import React, { useState, useEffect } from "react";
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
      "/user": "Profile",  // Default for user route
      "/login": "Login",
    };
  
    const pathSegments = location.pathname.split("/").filter((segment) => segment);
    const newBreadcrumbs = [];
  
    if (pathSegments.length > 0) {
      // Always start with "Home"
      newBreadcrumbs.push({ name: "Home", path: "/" });
  
      // Iterate over path segments
      pathSegments.forEach((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
  
        // If the segment corresponds to a predefined path in breadcrumbMap
        if (breadcrumbMap[path]) {
          newBreadcrumbs.push({ name: breadcrumbMap[path], path });
        } else if (pathSegments[index - 1] === "user") {
          // If "user" is the previous segment (meaning we're on a user profile page),
          // set the breadcrumb to "Profile" without including the userId.
        } else if (segment) {
          // Fallback for any other unknown segments, like post IDs or other dynamic segments
          newBreadcrumbs.push({ name: "Animal Profile", path });
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
