import React from "react";
import { Tooltip } from "react-tooltip";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBox.css";

const SearchBox = ({ input, setInput, onSearch }) => {
  return (
    <div className="search-box">
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search by species or common name"
      />
      <div>
        <span className={`send-icon ${input.length > 0 ? "show" : ""}`}>
          <SearchIcon
            onClick={() => onSearch(input)}
            data-tooltip-id="submit"
            data-tooltip-content="Submit"
            fontSize="medium"
          />
          <Tooltip
            id="submit"
            style={{
              padding: "5px",
              fontSize: "12px",
              color: "#f0f4f9",
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default SearchBox;
