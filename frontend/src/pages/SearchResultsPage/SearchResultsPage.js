import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";  
import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid, 
} from "@mui/material";

import "./SearchResultsPage.css";

// MUI Imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// MUI Icons
import PetsIcon from "@mui/icons-material/Pets";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ScienceIcon from "@mui/icons-material/Science";
import TerrainIcon from '@mui/icons-material/Terrain';  
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WavesIcon from '@mui/icons-material/Waves';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CloudIcon from '@mui/icons-material/Cloud';
import PublicIcon from '@mui/icons-material/Public';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip } from "react-tooltip";

import ImageCard from "../../components/Card/Card";
import SearchBox from "../../components/SearchBox/SearchBox";

const SearchResultsPage = () => {
  const [input, setInput] = useState("");
  const [animals, setAnimals] = useState([]);
  const [filters, setFilters] = useState({
    vhf: false,
    satellite: false,
    lora: false,
    acoustic: false,
    cell: false,
    bio: false,
    rfid: false,
    encapsulated: false,
    potting: false,
    shrink: false,
    hematic: false,
    harness: false,
    collar: false,
    adhesive: false,
    bolt: false,
    implant: false,
    mammal: false,
    reptile: false,
    amphibian: false,
    fish: false,
    bird: false,
  });

  const iconList = [
    PetsIcon,
    GpsFixedIcon,
    ScienceIcon,
    TerrainIcon,
    AcUnitIcon,      
    WavesIcon,       
    WhatshotIcon,    
    CloudIcon,       
    PublicIcon,      
    ElectricBoltIcon 
  ];

  // fetch animals data from the backend
  const fetchAnimals = useCallback(async () => {
    try {

      /*if (first_search) {
        console.log("ADFGDSGDSGS");
        // Grab the search query from the URL (if there)
        const searchParams = new URLSearchParams(window.location.search);

        // Update the input based on the URL parameters
        const titleQuery = searchParams.get('title') || "";

        // Update the title input
        setInput(titleQuery);
      }*/

      const trackerTypes = [];
      const attachmentTypes = [];
      const enclosureTypes = [];
      const animalFamily = [];

      // Build arrays based on selected filters
      if (filters.vhf) trackerTypes.push("VHF");
      if (filters.satellite) trackerTypes.push("Satellite");
      if (filters.lora) trackerTypes.push("LoRa");
      if (filters.acoustic) trackerTypes.push("Acoustic");
      if (filters.cell) trackerTypes.push("Cellular / GSM");
      if (filters.bio) trackerTypes.push("Bio-logger");
      if (filters.rfid) trackerTypes.push("RFID");

      if (filters.encapsulated) enclosureTypes.push("Encapsulated");
      if (filters.potting) enclosureTypes.push("Potting");
      if (filters.shrink) enclosureTypes.push("Shrink wrap");
      if (filters.hematic) enclosureTypes.push("Hematic seal");

      if (filters.bolt) attachmentTypes.push("Bolt");
      if (filters.harness) attachmentTypes.push("Harness");
      if (filters.collar) attachmentTypes.push("Collar");
      if (filters.adhesive) attachmentTypes.push("Adhesive");
      if (filters.implant) attachmentTypes.push("Implant");

      if (filters.mammal) animalFamily.push("Mammal");
      if (filters.reptile) animalFamily.push("Reptile");
      if (filters.amphibian) animalFamily.push("Amphibians");
      if (filters.fish) animalFamily.push("Fish");
      if (filters.bird) animalFamily.push("Bird");

      // Create query strings
      const trackerTypeQuery = trackerTypes.join(",");
      const attachmentTypeQuery = attachmentTypes.join(",");
      const enclosureTypeQuery = enclosureTypes.join(",");
      const animalFamilyQuery = animalFamily.join(",");

      console.log(animalFamilyQuery);

      //const titleQuery = searchParams.get('title');
      let request = `https://${window.location.hostname}:5001/api/posts/search?trackerType=${trackerTypeQuery}&attachmentType=${attachmentTypeQuery}&enclosureType=${enclosureTypeQuery}&animalType=${animalFamilyQuery}`;

      if (input && input.length > 0) {
        request += "&title=" + input;
      }

      const response = await fetch(request);
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [input]);

  // Use fetchAnimals inside useEffect and include it in the dependency array
  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  // function to randomly select icons
  const getRandomIcons = () => {
    const shuffledIcons = [...iconList].sort(() => 0.5 - Math.random());
    return shuffledIcons.slice(0, 3); 
  };

  // function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  const resetFilters = (event) => {
    
    filters.vhf = false;
    filters.satellite = false;
    filters.lora = false;
    filters.acoustic = false;
    filters.cell = false;
    filters.bio = false;
    filters.rfid = false;

    filters.encapsulated = false;
    filters.potting = false;
    filters.shrink = false;
    filters.hematic = false;

    filters.bolt = false;
    filters.harness = false;
    filters.collar = false;
    filters.adhesive = false;
    filters.implant = false;

    filters.mammal = false;
    filters.reptile = false;
    filters.amphibian = false;
    filters.fish = false;
    filters.bird = false;

    // Note: This function call doesnt exactly do anything,
    // But it DOES trigger a UI event that updates the checkbox visible 
    // values. Otherwise, the user would need to click in the form fields
    // to get them to visually reset.
    handleCheckboxChange(event);

  }

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Main content */}
      <Box sx={{ flexGrow: 1}}>

        <Box>
          <SearchBox input={input} setInput={setInput} onSearch={fetchAnimals} />
        </Box>

        <Grid container spacing={2}>
          {/* Filters on the left */}
          <Grid item xs={12} sm={3} md={2}>
            <Box sx={{ padding: 2, /*borderRight: "1px solid #ddd",*/ height: "105%", overflowY: "auto" }}>
              <div class="filter-group">
                <div class="filter-group-head-div-wrapper">
                  <div class="filter-group-head-div">
                    <Typography class="filter-group-head">Animal Type</Typography>
                  </div>
                </div>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={filters.mammal} onChange={handleCheckboxChange} name="mammal" />} label="Mammal" />
                  <FormControlLabel control={<Checkbox checked={filters.reptile} onChange={handleCheckboxChange} name="reptile" />} label="Reptile" />
                  <FormControlLabel control={<Checkbox checked={filters.amphibian} onChange={handleCheckboxChange} name="amphibian" />} label="Amphibian" />
                  <FormControlLabel control={<Checkbox checked={filters.fish} onChange={handleCheckboxChange} name="fish" />} label="Fish" />
                  <FormControlLabel control={<Checkbox checked={filters.bird} onChange={handleCheckboxChange} name="bird" />} label="Bird" />
                </FormGroup>
              </div>

              <div class="filter-group">
                <div class="filter-group-head-div-wrapper">
                  <div class="filter-group-head-div">
                    <Typography class="filter-group-head">Tracker Type</Typography>
                  </div>
                </div>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={filters.vhf} onChange={handleCheckboxChange} name="vhf" />} label="VHF" />
                  <FormControlLabel control={<Checkbox checked={filters.satellite} onChange={handleCheckboxChange} name="satellite" />} label="Satellite" />
                  <FormControlLabel control={<Checkbox checked={filters.lora} onChange={handleCheckboxChange} name="lora" />} label="LoRa" />
                  <FormControlLabel control={<Checkbox checked={filters.acoustic} onChange={handleCheckboxChange} name="acoustic" />} label="Acoustic" />
                  <FormControlLabel control={<Checkbox checked={filters.cell} onChange={handleCheckboxChange} name="cell" />} label="Cellular / GSM" />
                  <FormControlLabel control={<Checkbox checked={filters.bio} onChange={handleCheckboxChange} name="bio" />} label="Bio-logger" />
                  <FormControlLabel control={<Checkbox checked={filters.rfid} onChange={handleCheckboxChange} name="rfid" />} label="RFID" />
                </FormGroup>
              </div>
              <div class="filter-group">
                <div class="filter-group-head-div-wrapper">
                  <div class="filter-group-head-div">
                    <Typography class="filter-group-head">Enclosure Type</Typography>
                  </div>
                </div>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={filters.encapsulated} onChange={handleCheckboxChange} name="encapsulated" />} label="Encapsulated" />
                  <FormControlLabel control={<Checkbox checked={filters.shrink} onChange={handleCheckboxChange} name="shrink" />} label="Shrink wrap" />
                  <FormControlLabel control={<Checkbox checked={filters.potting} onChange={handleCheckboxChange} name="potting" />} label="Potting" />
                  <FormControlLabel control={<Checkbox checked={filters.hematic} onChange={handleCheckboxChange} name="hematic" />} label="Hematic seal" />
                </FormGroup>
              </div>

              <div class="filter-group">
                <div class="filter-group-head-div-wrapper">
                  <div class="filter-group-head-div">
                    <Typography class="filter-group-head">Attachment Type</Typography>
                  </div>
                </div>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={filters.harness} onChange={handleCheckboxChange} name="harness" />} label="Harness" />
                  <FormControlLabel control={<Checkbox checked={filters.collar} onChange={handleCheckboxChange} name="collar" />} label="Collar" />
                  <FormControlLabel control={<Checkbox checked={filters.bolt} onChange={handleCheckboxChange} name="bolt" />} label="Bolt" />
                  <FormControlLabel control={<Checkbox checked={filters.implant} onChange={handleCheckboxChange} name="implant" />} label="Implant" />
                  <FormControlLabel control={<Checkbox checked={filters.adhesive} onChange={handleCheckboxChange} name="adhesive" />} label="Adhesive" />
                </FormGroup>
              </div>

              {/* Filters button */}
              <div className="filters-button-box">
                <div className="apply-filter-container filter-button-container">
                  {/* Filter Icon */}
                  <div
                    className="apply-filter-icon"
                    onClick={fetchAnimals}
                    data-tooltip-id="apply-filter"
                    data-tooltip-content="Apply Filters"
                  >
                    <SearchIcon fontSize="medium" />
                    <div>Apply </div>
                  </div>
                </div>
                <div className="reset-filter-container filter-button-container">
                  {/* Reset Icon */}
                  <div
                    className="reset-filter-icon "
                    onClick={resetFilters}
                    data-tooltip-id="reset-filter"
                    data-tooltip-content="Reset"
                  >
                    <CancelIcon fontSize="medium" />
                    <div>Reset</div>
                  </div>
                </div>
              </div>
              
            </Box>
          </Grid>

          {/* Grid with animal cards */}
          <Grid item xs={12} sm={9} md={10}>
            <Grid container spacing={2}>
              {animals.map((animal, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <ImageCard
                    title={animal.title}
                    description={animal.trackerType}
                    post_id={animal._id}
                    image={animal.postImage}
                    animalType={animal.animalType}
                    trackerType={animal.trackerType}
                    icons={getRandomIcons()}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SearchResultsPage;
