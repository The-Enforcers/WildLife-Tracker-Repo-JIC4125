import React, { useRef, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList"; // Import Filter icon
import { useNavigate } from "react-router-dom";
import "./SearchBox.css";

const SearchBox = ({ input, setInput, onSearch, showFilter }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 400);

  const handlePostClick = () => {
    navigate("/create");
  };

  const handleFilterClick = () => {
    navigate("/posts");
  };

  const clearInput = () => {
    setInput("");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 400);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        onSearch();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [onSearch]);

  return (
    <>
      <div className="search-container">
        {/* Search Input Box */}
        <div className="search-box">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            ref={inputRef}
            placeholder={
              isSmallScreen
                ? "Search Posts"
                : "Search by title, author, scientific name, or common name"
            }
          />

          {input && (
            <span className="clear-icon" onClick={clearInput}>
              <ClearIcon fontSize="small" />
            </span>
          )}

          {!isSmallScreen && (
            <span className="search-icon" onClick={() => onSearch()}>
              <SearchIcon
                data-tooltip-id="search"
                data-tooltip-content="Search results"
                fontSize="medium"
                cursor="pointer"
              />
            </span>
          )}

          {showFilter && !isSmallScreen && (
            <span className="filter-icon" onClick={handleFilterClick}>
              <FilterListIcon
                data-tooltip-id="filter"
                data-tooltip-content="Filter posts"
                fontSize="medium"
                cursor="pointer"
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
          )}
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

export default SearchBox;
