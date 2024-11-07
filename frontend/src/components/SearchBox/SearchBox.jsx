import React, { useRef, useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"; // Import Clear Icon
import { useNavigate } from "react-router-dom";
import "./SearchBox.css";

const SearchBox = ({ input, setInput, onSearch }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate("/create");
  };

  // State variables for dropdown menus
  const [animal, setAnimal] = useState("");
  const [tracker, setTracker] = useState("");
  const [enclosure, setEnclosure] = useState("");
  const [attachment, setAttachment] = useState("");
  const [species, setSpecies] = useState("");

  // State for showing/hiding filters
  const [showFilters, setShowFilters] = useState(false);

  // Function to clear input
  const clearInput = () => {
    setInput("");
  };
  
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onSearch();
      }
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

      {/* Dropdown Menus with animation */}
      <div className={`dropdown-menus ${showFilters ? "show" : "hide"}`}>
        <select
          className="dropdown-menu"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
        >
          <option value="">Animal</option>
          <option value="mammal">Mammal</option>
          <option value="reptile">Reptile</option>
          <option value="amphibian">Amphibian</option>
          <option value="fish">Fish</option>
          <option value="bird">Bird</option>
        </select>

        <select
          className="dropdown-menu"
          value={tracker}
          onChange={(e) => setTracker(e.target.value)}
        >
          <option value="">Tracker</option>
          <option value="vhf">VHF</option>
          <option value="gps">GPS</option>
        </select>

        <select
          className="dropdown-menu"
          value={enclosure}
          onChange={(e) => setEnclosure(e.target.value)}
        >
          <option value="">Enclosure</option>
          <option value="encapsulated">Encapsulated</option>
          <option value="modular">Modular</option>
        </select>

        <select
          className="dropdown-menu"
          value={attachment}
          onChange={(e) => setAttachment(e.target.value)}
        >
          <option value="">Attachment</option>
          <option value="harness">Harness</option>
          <option value="collar">Collar</option>
          <option value="glueOn">Glue-on</option>
        </select>

        <select
          className="dropdown-menu"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        >
          <option value="">Species</option>
          <option value="mammal">Mammal</option>
          <option value="reptile">Reptile</option>
          <option value="amphibian">Amphibian</option>
          <option value="fish">Fish</option>
          <option value="bird">Bird</option>
          
        </select>

        {/* Apply Button */}
        <button
          className="apply-button"
          onClick={() => console.log("Applied!")}
        >
          Apply
        </button>
      </div>
    </>
  );
};

export default SearchBox;
