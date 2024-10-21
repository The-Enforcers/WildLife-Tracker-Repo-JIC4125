import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { Tooltip } from "react-tooltip";
import HelpPopup from "../HelpPopup/HelpPopup";

// MUI icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";

// wildlife movement institute logo
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [extended, setExtended] = useState(location.pathname === "/");
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);

  useEffect(() => {
    setExtended(location.pathname === "/");

    // Check if it's the beginning of a session
    const isFirstVisit = !localStorage.getItem("hasVisitedBefore");
    if (isFirstVisit) {
      setIsHelpPopupOpen(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, [location]);

  const toggleSidebar = () => {
    setExtended(!extended);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const openHelpPopup = () => {
    setIsHelpPopupOpen(true);
  };

  const closeHelpPopup = () => {
    setIsHelpPopupOpen(false);
  };

  return (
    <>
      <div
        className={`sidebar ${extended ? "extended" : "collapsed"}`}
        style={{ width: extended ? "17%" : "75px" }}
      >
        <div className="top">
          <div className="toggle-container">
            {extended ? (
              <>
                <div className="logo" onClick={() => handleNavigation("/")}>
                  <img
                    src={logo}
                    alt="Wildlife Movement Institute Logo"
                    className="logo-image"
                  />
                </div>

                <ChevronLeftIcon
                  onClick={toggleSidebar}
                  className="menu"
                  data-tooltip-id="menu"
                  data-tooltip-content="Collapse"
                />
              </>
            ) : (
              <>
                <ChevronRightIcon
                  onClick={toggleSidebar}
                  className="menu"
                  data-tooltip-id="menu"
                  data-tooltip-content="Expand"
                />
              </>
            )}
            <Tooltip id="menu" place="bottom" />
          </div>

          <div
            onClick={() => handleNavigation("/")}
            className="new-post"
            data-tooltip-id="home"
            data-tooltip-content="Home"
          >
            <HomeIcon />
            <Tooltip id="home" place="bottom" />
            {extended && <p>Home</p>}
          </div>

          <div
            onClick={() => handleNavigation("/create")}
            className="new-post"
            data-tooltip-id="new-post"
            data-tooltip-content="New Post"
          >
            <AddIcon />
            <Tooltip id="new-post" place="bottom" />
            {extended && <p>New Post</p>}
          </div>

          <div
            onClick={() => handleNavigation("/results")}
            className="view-posts"
            data-tooltip-id="view-posts"
            data-tooltip-content="View Posts"
          >
            <VisibilityIcon />
            <Tooltip id="view-posts" place="bottom" />
            {extended && <p>View Posts</p>}
          </div>
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry" onClick={openHelpPopup}>
            <HelpOutlineIcon />
            {extended && <p>Help</p>}
          </div>
          <div className="bottom-item recent-entry">
            <HistoryIcon />
            {extended && <p>Activity</p>}
          </div>
          <div className="bottom-item recent-entry">
            <SettingsIcon />
            {extended && <p>Settings</p>}
          </div>
        </div>
      </div>
      <HelpPopup isOpen={isHelpPopupOpen} onClose={closeHelpPopup} />
    </>
  );
};

export default Sidebar;
