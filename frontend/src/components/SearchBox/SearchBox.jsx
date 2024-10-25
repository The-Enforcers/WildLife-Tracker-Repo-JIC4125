import React, { useState} from "react";
import { Tooltip } from "react-tooltip";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";

import "./SearchBox.css";

const MainSearchBox = ({ input, setInput, onSearch }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate("/create");
  };

  return (
    <>
      <div className="search-container">
        {/* Search Input Box */}
        <div className="search-box">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by species or common name"
          />
          
          <span
            className="search-icon"
            onClick={() => onSearch()}
          >
            <SearchIcon
              data-tooltip-id="search"
              data-tooltip-content="search results"
              fontSize="medium"
            />
            <Tooltip
              id="Search"
              style={{
                padding: "5px",
                fontSize: "12px",
                color: "#f0f4f9",
              }}
            />
          </span>
        </div>

        {/* Post button */}
        <div className="icons-container">
          {/* Add Icon */}
          <div
            className="new-add-icon"
            onClick={handlePostClick}
            data-tooltip-id="add-new"
            data-tooltip-content="Create new post"
          >
            <AddIcon fontSize="medium" />
            <div>Post</div>
            <Tooltip
              id="add-new"
              style={{ padding: "5px", fontSize: "12px", color: "#f0f4f9" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainSearchBox;
