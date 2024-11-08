import React, { useRef, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import "./SearchBox.css";

const SearchBox = ({ input, setInput, onSearch }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handlePostClick = () => {
    navigate("/create");
  };


  // Function to clear input
  const clearInput = () => {
    setInput("");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onSearch();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
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
            placeholder="Search by species or common name"
          />

          {/* Clear Icon: Show only when there's input */}
          {input && (
            <span className="clear-icon" onClick={clearInput}>
              <ClearIcon fontSize="small" />
            </span>
          )}

          <span
            className="search-icon"
            onClick={() => onSearch()}
          >
            <SearchIcon
              data-tooltip-id="search"
              data-tooltip-content="search results"
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
