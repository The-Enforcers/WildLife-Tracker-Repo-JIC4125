import React, { useState, useEffect, useRef } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

// MUI components
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// wildlife movement institute logo
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [extended, setExtended] = useState(location.pathname === "/");
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const iconRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 400);

  // For mobile dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Define tutorial steps
  const tutorialSteps = [
    {
      iconId: "new-post",
      text: "This is where you can create a new animal profile.",
      refIndex: 1,
    },
    {
      iconId: "search-posts",
      text: "Here, you can search for all the posts that have been submitted.",
      refIndex: 2,
    },
    {
      iconId: "help",
      text: "Need help? Click here for assistance.",
      refIndex: 3,
    },
  ];

  // Check if the user has visited before and initialize the tutorial state
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("visitedBefore");

    if (!hasVisitedBefore) {
      // First time visit, show help popup and tutorial
      setIsHelpPopupOpen(true);
      localStorage.setItem("visitedBefore", "true");
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 400);

      if (window.innerWidth < 810) {
        setExtended(false);
      } else if (location.pathname === "/" && !tutorialActive) {
        setExtended(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location, tutorialActive]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setExtended(!extended);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      handleMenuClose();
    }
  };

  const closeHelpPopup = () => {
    setIsHelpPopupOpen(false);
    setTutorialActive(true); // Start tutorial after the help popup is closed
  };

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setTutorialActive(false); // End tutorial
    }
  };

  // Get the position of the current icon being highlighted
  const getIconPosition = () => {
    const ref = iconRefs.current[tutorialSteps[currentStep].refIndex];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }
    return { top: 0, left: 0, width: 0, height: 0 };
  };

  return (
    <>
      {isMobile && (
        <>
          <MenuIcon onClick={handleMenuClick} className="menu-icon" />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleNavigation("/")}>
              <HomeIcon style={{ marginRight: "10px" }} />
              Home
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/create")}>
              <AddIcon style={{ marginRight: "10px" }} />
              New Animal Profile
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/posts")}>
              <SearchIcon style={{ marginRight: "10px" }} />
              Search Animal Profiles
            </MenuItem>
          </Menu>
        </>
      )}

      {!isMobile && (
        <div
          className={`sidebar ${extended ? "extended" : "collapsed"}`}
          style={{ width: extended ? "255px" : "75px" }}
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
              ref={(el) => (iconRefs.current[0] = el)}
              onClick={() => handleNavigation("/")}
              className={`new-post ${currentStep === 0 ? "highlight" : ""}`}
            >
              <HomeIcon />
              <Tooltip id="home" place="bottom" />
              {extended && <p>Home</p>}
            </div>

            <div
              ref={(el) => (iconRefs.current[1] = el)}
              onClick={() => handleNavigation("/create")}
              className={`new-post ${currentStep === 1 ? "highlight" : ""}`}
            >
              <AddIcon />
              <Tooltip id="new-post" place="bottom" />
              {extended && <p>New Animal Profile</p>}
            </div>

            <div
              ref={(el) => (iconRefs.current[2] = el)}
              onClick={() => handleNavigation("/posts")}
              className={`search-posts ${currentStep === 2 ? "highlight" : ""}`}
            >
              <SearchIcon />
              <Tooltip id="search-posts" place="bottom" />
              {extended && <p>Search Animal Profiles</p>}
            </div>
          </div>
          <div className="bottom">
            <div
              ref={(el) => (iconRefs.current[3] = el)}
              className={`bottom-item recent-entry ${
                currentStep === 3 ? "highlight" : ""
              }`}
              onClick={() => setTutorialActive(true)}
            >
              <HelpOutlineIcon />
              {extended && <p>Help</p>}
            </div>
          </div>
        </div>
      )}

      {isHelpPopupOpen && (
        <HelpPopup isOpen={isHelpPopupOpen} onClose={closeHelpPopup} />
      )}

      {tutorialActive && (
        <div className="tutorial-backdrop">
          <div
            className="tutorial-highlight"
            style={{
              top: `${getIconPosition().top}px`,
              left: `${getIconPosition().left}px`,
              width: `${getIconPosition().width}px`,
              height: `${getIconPosition().height}px`,
            }}
          />
          <div
            className="tutorial-content"
            style={{
              top: `${
                getIconPosition().top + getIconPosition().height + 150 >
                window.innerHeight
                  ? getIconPosition().top - 100
                  : getIconPosition().top + getIconPosition().height + 10
              }px`,
              left: `${
                getIconPosition().left + getIconPosition().width + 20
              }px`,
            }}
          >
            <p>{tutorialSteps[currentStep].text}</p>
            <button onClick={handleNextStep} className="tutorial-btn">
              {currentStep < tutorialSteps.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
