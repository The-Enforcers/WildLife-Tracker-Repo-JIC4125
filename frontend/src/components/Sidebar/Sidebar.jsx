import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { Tooltip } from "react-tooltip";

// MUI icons
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Home from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const navigate = useNavigate();

  let sidebarWidth = extended ? "75px" : "18%";

  return (
    <div className="sidebar" style={{ width: sidebarWidth }}>
      <div className="top">
        <MenuIcon
          onClick={() => setExtended(!extended)}
          className="menu"
          data-tooltip-id="menu"
          data-tooltip-content={extended ? "Expand" : "Collapse"}
        />
        <Tooltip
          id="menu"
          place={"bottom"}
          style={{ padding: "5px", fontSize: "12px", color: "#f0f4f9" }}
        />

        {/* Home */}
        <div
          onClick={() => navigate("/")}
          className="new-post"
          data-tooltip-id="new-post"
          data-tooltip-content="Home"
        >
          <Home />
          <Tooltip
            id="home"
            place={"bottom"}
            style={{ padding: "5px", fontSize: "12px", color: "#f0f4f9" }}
          />
          {!extended && <p>Home</p>}
        </div>

        {/* New Post */}
        <div
          onClick={() => navigate("/create")}
          className="new-post"
          data-tooltip-id="new-post"
          data-tooltip-content="New Post"
        >
          <AddIcon />
          <Tooltip
            id="new-post"
            place={"bottom"}
            style={{ padding: "5px", fontSize: "12px", color: "#f0f4f9" }}
          />
          {!extended && <p>New Post</p>}
        </div>

        {/* View Posts */}
        <div
          onClick={() => navigate("/results")}
          className="view-posts"
          data-tooltip-id="view-posts"
          data-tooltip-content="View Posts"
        >
          <VisibilityIcon />
          <Tooltip
            id="view-posts"
            place={"bottom"}
            style={{ padding: "5px", fontSize: "12px", color: "#f0f4f9" }}
          />
          {!extended && <p>View Posts</p>}
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <HelpOutlineIcon />
          {!extended && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <HistoryIcon />
          {!extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <SettingsIcon />
          {!extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
