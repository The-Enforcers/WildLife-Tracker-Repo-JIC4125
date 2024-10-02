import React, { useState, useEffect } from "react";
import { Container, Box, Checkbox, FormGroup, FormControlLabel, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid";
import ImageCard from "../../components/Card/Card";
import Sidebar from "../../components/Sidebar/Sidebar";
import SearchBox from "../../components/SearchBox/SearchBox";

const SearchResultsPage = () => {
  const [input, setInput] = useState("");
  const [animals, setAnimals] = useState([]);
  const [filters, setFilters] = useState({
    vhf: false,
    gps: false,
    encapsulated: false,
    modular: false,
    harness: false,
    collar: false,
    glueOn: false,
  });

  const imageUrls = [
    "https://plus.unsplash.com/premium_photo-1675432656807-216d786dd468?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675714692711-d1aac0262feb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673455210376-fb94ce182ff4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661936536518-4c6fa37f5ba8?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661940855582-ccfec6edbf51?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  // fetch data from the MongoDB backend
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("https://localhost:5001/api/posts");
        const data = await response.json();
        console.log(data);
        setAnimals(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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
  const applyFilters = () => {
    console.log("Applied filters:", filters);
    // You can add filter logic here to filter the `animals` array
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
          <SearchBox input={input} setInput={setInput} />
        </Box>

        <Grid container spacing={2}>
          {/* Filters on the left, below the search box */}
          <Grid item xs={12} sm={3} md={2}>
            <Box sx={{ padding: 2, borderRight: "1px solid #ddd", height: "100%", overflowY: "auto" }}>
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
                          checked={filters.gps}
                          onChange={handleCheckboxChange}
                          name="gps"
                        />
                      }
                      label="GPS"
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
                          checked={filters.modular}
                          onChange={handleCheckboxChange}
                          name="modular"
                        />
                      }
                      label="Modular"
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
                          checked={filters.glueOn}
                          onChange={handleCheckboxChange}
                          name="glueOn"
                        />
                      }
                      label="Glue-on"
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
                      image={getRandomImage()} // randomly selected image
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
