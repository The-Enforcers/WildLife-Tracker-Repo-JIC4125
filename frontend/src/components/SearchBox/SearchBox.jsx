import React from "react";
import { Tooltip } from "react-tooltip";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useNavigate } from "react-router-dom";
import "./SearchBox.css";

const SearchBox = ({ input, setInput, onSearch }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate("/create"); 
  };

  return (
    <div className="search-container">
      {/* Search Input Box */}
      <div className="search-box">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Search by species or common name"
        />

        <span className="filter-icon">
          <FilterListIcon
            data-tooltip-id="filter"
            data-tooltip-content="Filter results"
            fontSize="medium"
          />
          <Tooltip
            id="filter"
            style={{
              padding: "5px",
              fontSize: "12px",
              color: "#f0f4f9",
            }}
          />
        </span>
      </div>

      {/* Icons Outside the Search Box */}
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
  );
};

export default SearchBox;
