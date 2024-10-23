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
  const [tutorialActive, setTutorialActive] = useState(false);  
  const [currentStep, setCurrentStep] = useState(0); 
  const iconRefs = useRef([]);  

  // Define tutorial steps
  const tutorialSteps = [
    { iconId: "new-post", text: "This is where you can create a new post.", refIndex: 1 },
    { iconId: "view-posts", text: "Here, you can view all the posts that have been submitted.", refIndex: 2 },
    { iconId: "help", text: "Need help? Click here for assistance.", refIndex: 3 }
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

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setExtended(false);
      } else if (location.pathname === "/") {
        setExtended(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location]);

  const toggleSidebar = () => {
    setExtended(!extended);
  };

  const handleNavigation = (path) => {
    navigate(path);
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
      return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    }
    return { top: 0, left: 0, width: 0, height: 0 };
  };

  return (
    <>
      <div
        className={`sidebar ${extended ? "extended" : "collapsed"}`}
        style={{ width: extended ? "260px" : "75px" }}
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
            data-tooltip-id="home"
            data-tooltip-content="Home"
          >
            <HomeIcon />
            <Tooltip id="home" place="bottom" />
            {extended && <p>Home</p>}
          </div>

          <div
            ref={(el) => (iconRefs.current[1] = el)}
            onClick={() => handleNavigation("/create")}
            className={`new-post ${currentStep === 1 ? "highlight" : ""}`}
            data-tooltip-id="new-post"
            data-tooltip-content="New Post"
          >
            <AddIcon />
            <Tooltip id="new-post" place="bottom" />
            {extended && <p>New Post</p>}
          </div>

          <div
            ref={(el) => (iconRefs.current[2] = el)}
            onClick={() => handleNavigation("/results")}
            className={`view-posts ${currentStep === 2 ? "highlight" : ""}`}
            data-tooltip-id="view-posts"
            data-tooltip-content="View Posts"
          >
            <VisibilityIcon />
            <Tooltip id="view-posts" place="bottom" />
            {extended && <p>View Posts</p>}
          </div>
        </div>
        <div className="bottom">
          <div
            ref={(el) => (iconRefs.current[3] = el)}
            className={`bottom-item recent-entry ${currentStep === 3 ? "highlight" : ""}`}
            onClick={() => setTutorialActive(true)}
          >
            <HelpOutlineIcon />
            {extended && <p>Help</p>}
          </div>
        </div>
      </div>

      {isHelpPopupOpen && <HelpPopup isOpen={isHelpPopupOpen} onClose={closeHelpPopup} />}

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
                getIconPosition().top + getIconPosition().height + 150 > window.innerHeight
                  ? getIconPosition().top - 100
                  : getIconPosition().top + getIconPosition().height + 10
              }px`,
              left: `${getIconPosition().left + getIconPosition().width + 20}px`,
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
