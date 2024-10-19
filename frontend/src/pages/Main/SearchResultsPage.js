import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import ImageCard from "../../components/Card/Card";
import Sidebar from "../../components/Sidebar/Sidebar";
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
    bird: false
  });
  const imageUrls = [
    "https://plus.unsplash.com/premium_photo-1675432656807-216d786dd468?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675714692711-d1aac0262feb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673455210376-fb94ce182ff4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661936536518-4c6fa37f5ba8?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661940855582-ccfec6edbf51?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  // Fetch animals data from the backend
  const fetchAnimals = async () => {
    try {
      let request = "https://localhost:5001/api/posts";

      if (input && input.length > 0) {
        request += "/search?title=" + input;
      }

      const response = await fetch(request);
      const data = await response.json();
      console.log(data);
      setAnimals(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch animals data on component mount
  useEffect(() => {
    fetchAnimals();
  }, []);

  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  // Function to handle filter button click
  const applyFilters = async () => {
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

    try {
      const response = await fetch(
        `https://localhost:5001/api/posts/search?trackerType=${trackerTypeQuery}&attachmentType=${attachmentTypeQuery}&enclosureType=${enclosureTypeQuery}&animalType=${animalFamilyQuery}`
      );
      const data = await response.json();
      console.log("Filtered data:", data);
      setAnimals(data); // Update state with filtered animals
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  // Function to pick a random image from the imageUrls array
  const getRandomImage = () => {
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {/* SearchBox spans the entire width */}
        <Box sx={{ marginBottom: 2 }}>
          <SearchBox input={input} setInput={setInput} onSearch={fetchAnimals} />
        </Box>

        <Grid container spacing={2}>
          {/* Filters on the left, below the search box */}
          <Grid item xs={12} sm={3} md={2}>
            <Box sx={{ padding: 2, borderRight: "1px solid #ddd", height: "100%", overflowY: "auto" }}>
              {/* Accordion for Animal Family */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Animal Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.mammal}
                          onChange={handleCheckboxChange}
                          name="mammal"
                        />
                      }
                      label="Mammal"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.reptile}
                          onChange={handleCheckboxChange}
                          name="reptile"
                        />
                      }
                      label="Reptile"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.amphibian}
                          onChange={handleCheckboxChange}
                          name="amphibian"
                        />
                      }
                      label="Amphibian"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.fish}
                          onChange={handleCheckboxChange}
                          name="fish"
                        />
                      }
                      label="Fish"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.bird}
                          onChange={handleCheckboxChange}
                          name="bird"
                        />
                      }
                      label="Bird"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              
              {/* Accordion for Tracker Type */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Tracker Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.vhf}
                          onChange={handleCheckboxChange}
                          name="vhf"
                        />
                      }
                      label="VHF"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.satellite}
                          onChange={handleCheckboxChange}
                          name="satellite"
                        />
                      }
                      label="Satellite"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.lora}
                          onChange={handleCheckboxChange}
                          name="lora"
                        />
                      }
                      label="LoRa"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.acoustic}
                          onChange={handleCheckboxChange}
                          name="acoustic"
                        />
                      }
                      label="Acoustic"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.cell}
                          onChange={handleCheckboxChange}
                          name="cell"
                        />
                      }
                      label="Cellular / GSM"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.bio}
                          onChange={handleCheckboxChange}
                          name="bio"
                        />
                      }
                      label="Bio-logger"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.rfid}
                          onChange={handleCheckboxChange}
                          name="rfid"
                        />
                      }
                      label="RFID"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              {/* Accordion for Enclosure Type */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Enclosure Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.encapsulated}
                          onChange={handleCheckboxChange}
                          name="encapsulated"
                        />
                      }
                      label="Encapsulated"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.shrink}
                          onChange={handleCheckboxChange}
                          name="shrink"
                        />
                      }
                      label="Shrink wrap"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.potting}
                          onChange={handleCheckboxChange}
                          name="potting"
                        />
                      }
                      label="Potting"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.hematic}
                          onChange={handleCheckboxChange}
                          name="hematic"
                        />
                      }
                      label="Hematic seal"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              {/* Accordion for Attachment Type */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Attachment Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.harness}
                          onChange={handleCheckboxChange}
                          name="harness"
                        />
                      }
                      label="Harness"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.collar}
                          onChange={handleCheckboxChange}
                          name="collar"
                        />
                      }
                      label="Collar"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.bolt}
                          onChange={handleCheckboxChange}
                          name="bolt"
                        />
                      }
                      label="Bolt"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.implant}
                          onChange={handleCheckboxChange}
                          name="implant"
                        />
                      }
                      label="Implant"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.adhesive}
                          onChange={handleCheckboxChange}
                          name="adhesive"
                        />
                      }
                      label="Adhesive"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              {/* Apply Filters Button */}
              <Button variant="contained" onClick={applyFilters} sx={{ marginTop: 2 }}>
                Apply Filters
              </Button>
            </Box>
          </Grid>

          {/* Grid with animal cards */}
          <Grid item xs={12} sm={9} md={10}>
            <Container>
              <Grid container spacing={2}>
                {animals.map((animal, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    <ImageCard
                      title={animal.title} // title from MongoDB
                      description={animal.tracker} // description from MongoDB
                      post_id={animal._id} // Post id from MongoDB
                      image={animal.postImage}
                    />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SearchResultsPage;
