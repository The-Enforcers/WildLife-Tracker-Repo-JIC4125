import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
} from "@mui/material";
import debounce from "lodash/debounce";

import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./SearchResultsPage.css";

import ImageCard from "../../components/Card/Card";
import SearchBox from "../../components/SearchBox/SearchBox";
import { searchPosts } from "../../services/postService";
import { UserContext } from "../../context/UserContext";

const gridTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 900,
      md: 1300,
      lg: 1600,
      xl: 1920,
    },
  },
});

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // Get initial values from URL query params (or defaults)
  const initialInput = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(false);
  const [input, setInput] = useState(initialInput);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [animals, setAnimals] = useState([]);
  //const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 12,
  });

  // New state variable to track view mode
  const { viewMode } = useContext(UserContext);

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
    newToOld: searchParams.get("newToOld") !== "false",
    oldToNew: searchParams.get("oldToNew") === "true",
    mostLiked: searchParams.get("mostLiked") === "true",
  };
  const [filters, setFilters] = useState(initialFilters);

  const clearFilters = () => {
    setCurrentPage(1);
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
      newToOld: true,
      oldToNew: false,
      mostLiked: false,
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCurrentPage(1);
    if (name === "newToOld" || name === "oldToNew" || name === "mostLiked") {
      setFilters((prev) => ({
        ...prev,
        newToOld: name === "newToOld" ? checked : false,
        oldToNew: name === "oldToNew" ? checked : false,
        mostLiked: name === "mostLiked" ? checked : false,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Debounced applyFilters function
  // eslint-disable-next-line
  const debouncedApplyFilters = useCallback(
    debounce(async () => {
      // Start a timer for showing loading state
      const loadingTimer = setTimeout(() => {
        setIsLoadingDelayed(true);
      }, 500); // Only show loading if the request takes more than 500ms

      try {
        const response = await searchPosts({
          page: currentPage,
          limit: 12,
          search: input,
          filters: filters,
        });

        setAnimals(response.posts);
        setPagination(response.pagination);

        // Update URL parameters
        const params = {
          search: input,
          page: currentPage.toString(),
          ...Object.keys(filters)
            .filter((key) => filters[key])
            .reduce((acc, key) => {
              acc[key] = "true";
              return acc;
            }, {}),
        };
        setSearchParams(params);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        clearTimeout(loadingTimer);
        setIsLoadingDelayed(false);
      }
    }, 300),
    [input, filters, currentPage, setSearchParams]
  );

  useEffect(() => {
    debouncedApplyFilters();

    // Cleanup function
    return () => {
      debouncedApplyFilters.cancel();
    };
  }, [debouncedApplyFilters]);
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100%",
          overflowY: "hidden",
          flexFlow: "column",
        }}
      >
        <Box sx={{ flex: "0 0 auto" }}>
          <Box sx={{ marginBottom: 2, top: 0 }}>
            <SearchBox
              input={input}
              setInput={setInput}
              onSearch={() => {
                setCurrentPage(1);
                debouncedApplyFilters();
              }}
              showFilter={false}
              showView={true}
            />
          </Box>
        </Box>

        <div
          className="filters-and-results-box"
          style={{
            height: "100vh",
            overflowY: "hidden",
            display: "flex",
            flex: "1 1 auto",
          }}
        >
          <div
            className="filters-main-box"
            sx={{
              height: "100%",
              overflowY: "hidden",
              display: "flex",
              flexBasis: "20%",
              flexFlow: "column",
            }}
          >
            <div className="filters-box">
              {/* Animal Family Filter */}
              <Accordion
                className="filter-group"
                defaultExpanded={true}
                sx={{
                  backgroundColor: "#f0f4f9",
                  boxShadow: "none",
                  borderRadius: "15px",
                  "&:first-of-type": {
                    borderRadius: "15px",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Family</Typography>
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

              <Accordion
                className="filter-group"
                defaultExpanded={false}
                sx={{
                  backgroundColor: "#f0f4f9",
                  boxShadow: "none",
                  borderRadius: "15px",
                  "&:first-of-type": {
                    borderRadius: "15px",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Tracker</Typography>
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

              <Accordion
                className="filter-group"
                defaultExpanded={false}
                sx={{
                  backgroundColor: "#f0f4f9",
                  boxShadow: "none",
                  borderRadius: "15px",
                  "&:first-of-type": {
                    borderRadius: "15px",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Enclosure</Typography>
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

              <Accordion
                className="filter-group"
                defaultExpanded={false}
                sx={{
                  backgroundColor: "#f0f4f9",
                  boxShadow: "none",
                  borderRadius: "15px",
                  "&:first-of-type": {
                    borderRadius: "15px",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Attachment</Typography>
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
              <Accordion
                className="filter-group"
                defaultExpanded={true}
                sx={{
                  backgroundColor: "#f0f4f9",
                  boxShadow: "none",
                  borderRadius: "15px",
                  "&:first-of-type": {
                    borderRadius: "15px",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Sort By</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.newToOld}
                          onChange={handleCheckboxChange}
                          name="newToOld"
                        />
                      }
                      label="Newest"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.oldToNew}
                          onChange={handleCheckboxChange}
                          name="oldToNew"
                        />
                      }
                      label="Oldest"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.mostLiked}
                          onChange={handleCheckboxChange}
                          name="mostLiked"
                        />
                      }
                      label="Most Liked"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            </div>

            <div className="filters-button-box">
              <div className="apply-filter-container filter-button-container">
                <div
                  className="apply-filter-icon"
                  onClick={debouncedApplyFilters}
                  data-tooltip-id="apply-filter"
                  data-tooltip-content="Apply Filters"
                >
                  <SearchIcon fontSize="medium" />
                  <div>Apply </div>
                </div>
              </div>
              <div className="reset-filter-container filter-button-container">
                <div
                  className="reset-filter-icon"
                  onClick={clearFilters}
                  data-tooltip-id="reset-filter"
                  data-tooltip-content="Reset"
                >
                  <CancelIcon fontSize="medium" />
                  <div>Clear</div>
                </div>
              </div>
            </div>
          </div>
          <ThemeProvider theme={gridTheme}>
            {isLoadingDelayed ? (
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
              <>
                {/* Conditional Rendering based on viewMode */}
                {viewMode ? (
                  <Box
                    sx={{
                      marginBottom: pagination.totalPages > 1 ? "24px" : "64px",
                      width: { xs: "100%", sm: "70%" },
                      margin: "0 auto",
                      overflowY: "auto",
                    }}
                  >
                    {animals.map((animal, index) => (
                      <Box
                        key={index}
                        onClick={() => navigate(`/posts/${animal._id}`)} // Navigate to post on card click
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          marginBottom: 2,
                          gap: 6,
                          padding: 2,
                          backgroundColor: "#f9f9f9",
                          borderRadius: "25px",
                          alignItems: "center",
                          width: "100%",
                          cursor: "pointer",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                        }}
                      >
                        {/* Post Image */}
                        <img
                          src={`https://${window.location.hostname}:5001/api/posts/image/${animal.postImage}`}
                          alt={animal.title}
                          style={{
                            width: "170px",
                            height: "auto",
                            marginRight: "16px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Content Section */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" gutterBottom>
                            <strong>{animal.title}</strong>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Scientific Name:</strong>{" "}
                            {animal.scientificName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Common Name:</strong> {animal.commonName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Tracker Type:</strong> {animal.trackerType}
                          </Typography>

                          {/* Author Section */}
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/user/${animal.authorId}`);
                            }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "10px",
                              background: "#f0f4f9",
                              width: "fit-content",
                              padding: "5px",
                              borderRadius: "30px",
                              paddingRight: "60px",
                              backgroundColor: "#D5D5D5",
                              transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.01)",
                                boxShadow: 3,
                              },
                            }}
                          >
                            {/* Author Image */}
                            <img
                              src={`${animal.authorImage}`}
                              alt={animal.author}
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%", // Circle shape for author image
                                objectFit: "cover",
                                marginRight: "8px", // Space between image and name
                                cursor: "pointer", // Indicate that the image is clickable
                              }}
                            />

                            {/* Author Name */}
                            <Typography variant="body2" color="textSecondary">
                              <strong>{animal.author}</strong>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <div className="animal-cards-box">
                    <div className="animal-cards-box-inner">
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          marginBottom:
                            pagination.totalPages > 1 ? "24px" : "64px",
                          maxWidth: "100%",
                        }}
                      >
                        {animals.map((animal, index) => {
                          const itemCount = animals.length;
                          let gridProps;

                          if (itemCount === 1) {
                            gridProps = {
                              xs: 12,
                              sm: 12,
                              md: 12,
                              lg: 12,
                            };
                          } else if (itemCount === 2) {
                            gridProps = {
                              xs: 12,
                              sm: 6,
                              md: 6,
                              lg: 6,
                            };
                          } else if (itemCount === 3) {
                            gridProps = {
                              xs: 12,
                              sm: 6,
                              md: 4,
                              lg: 4,
                            };
                          } else {
                            gridProps = {
                              xs: 12,
                              sm: 6,
                              md: 4,
                              lg: 3,
                            };
                          }

                          return (
                            <Grid
                              item
                              key={index}
                              {...gridProps}
                              sx={{ display: "flex" }}
                            >
                              <ImageCard
                                title={animal.title}
                                description={animal.trackerType}
                                post_id={animal._id}
                                image={animal.postImage}
                                author={animal.author}
                                authorImage={animal.authorImage}
                                authorId={animal.authorId}
                                created={animal.date}
                                lastUpdated={animal.lastUpdated}
                                scientificName={animal.scientificName}
                                commonName={animal.commonName}
                                animalType={animal.animalType}
                                trackerType={animal.trackerType}
                                enclosureType={animal.enclosureType}
                                likeCount={animal.likeCount || 0}
                                showDetails={true}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "10px 0",
                          position: "sticky",
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0)",
                          zIndex: 1,
                          flex: "1 0 80px",
                          paddingBottom: "50px",
                        }}
                      >
                        <Pagination
                          count={pagination.totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
                          showFirstButton
                          showLastButton
                          sx={{
                            backgroundColor: "#f0f4f9",
                            padding: "10px",
                            borderRadius: "25px",
                            border: "1px solid lightgray",
                          }}
                        />
                      </Box>
                    </div>
                  </div>
                )}
              </>
            )}
          </ThemeProvider>
        </div>
      </Box>
    </Box>
  );
};

export default SearchResultsPage;
