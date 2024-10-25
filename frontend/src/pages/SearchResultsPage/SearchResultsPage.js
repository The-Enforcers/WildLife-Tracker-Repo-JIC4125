import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
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
  Breadcrumbs,
  CircularProgress,
} from "@mui/material";

// MUI Imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// MUI Icons
import PetsIcon from "@mui/icons-material/Pets";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ScienceIcon from "@mui/icons-material/Science";
import TerrainIcon from "@mui/icons-material/Terrain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WavesIcon from "@mui/icons-material/Waves";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CloudIcon from "@mui/icons-material/Cloud";
import PublicIcon from "@mui/icons-material/Public";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import ImageCard from "../../components/Card/Card";
import SearchBox from "../../components/SearchBox/SearchBox";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL query params (or defaults)
  const initialInput = searchParams.get("search") || "";
  const [input, setInput] = useState(initialInput);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialFilters = {
    vhf: searchParams.get("vhf") === "true",
    satellite: searchParams.get("satellite") === "true",
    lora: searchParams.get("lora") === "true",
    acoustic: searchParams.get("acoustic") === "true",
    cell: searchParams.get("cell") === "true",
    bio: searchParams.get("bio") === "true",
    rfid: searchParams.get("rfid") === "true",
    encapsulated: searchParams.get("encapsulated") === "true",
    potting: searchParams.get("potting") === "true",
    shrink: searchParams.get("shrink") === "true",
    hematic: searchParams.get("hematic") === "true",
    harness: searchParams.get("harness") === "true",
    collar: searchParams.get("collar") === "true",
    adhesive: searchParams.get("adhesive") === "true",
    bolt: searchParams.get("bolt") === "true",
    implant: searchParams.get("implant") === "true",
    mammal: searchParams.get("mammal") === "true",
    reptile: searchParams.get("reptile") === "true",
    amphibian: searchParams.get("amphibian") === "true",
    fish: searchParams.get("fish") === "true",
    bird: searchParams.get("bird") === "true",
  };
  const [filters, setFilters] = useState(initialFilters);

  // clear all filters
  const clearFilters = () => {
    setFilters({
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
  };

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
    ElectricBoltIcon,
  ];

  // Update URL parameters whenever input or filters change
  useEffect(() => {
    const params = {
      search: input,
      ...Object.keys(filters)
        .filter((key) => filters[key])
        .reduce((acc, key) => {
          acc[key] = "true";
          return acc;
        }, {}),
    };
    setSearchParams(params);
  }, [input, filters, setSearchParams]);

  // Fetch animals data from the backend
  const fetchAnimals = useCallback(async () => {
    setLoading(true);
    try {
      let request = `https://${window.location.hostname}:5001/api/posts`;

      if (input && input.length > 0) {
        request += "/search?title=" + input;
      }

      const response = await fetch(request);
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [input]);

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

  // Function to handle filter button click
  const applyFilters = async () => {
    setLoading(true);
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
        `https://${window.location.hostname}:5001/api/posts/search?trackerType=${trackerTypeQuery}&attachmentType=${attachmentTypeQuery}&enclosureType=${enclosureTypeQuery}&animalType=${animalFamilyQuery}`
      );
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Main content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Breadcrumbs section */}
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ marginLeft: 4, marginBlock: 1 }}
        >
          <RouterLink
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Home
          </RouterLink>
          <Typography color="text.primary">Posts</Typography>
        </Breadcrumbs>

        <Box sx={{ marginBottom: 2 }}>
          <SearchBox
            input={input}
            setInput={setInput}
            onSearch={fetchAnimals}
          />
        </Box>

        <Grid container spacing={1}>
          {/* Filters on the left */}
          <Grid item xs={12} sm={3} md={2}>
            <Box
              sx={{
                padding: 1,
                borderRight: "1px solid #ddd",
                height: "100%",
                overflowY: "auto",
              }}
            >
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
              {/* Clear Filters Button */}
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{
                  marginTop: 2,
                  color: "#2e3339fc",
                  borderColor: "#2e333994",
                }}
                fullWidth
              >
                Clear Filters
              </Button>
              {/* Apply Filters Button */}
              <Button
                variant="contained"
                onClick={applyFilters}
                sx={{ marginTop: 1, backgroundColor: "#212e38" }}
                fullWidth
              >
                Apply Filters
              </Button>
            </Box>
          </Grid>

          {/* Grid with animal cards */}
          <Grid item xs={12} sm={9} md={10} sx={{ pb: 2 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
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
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SearchResultsPage;
