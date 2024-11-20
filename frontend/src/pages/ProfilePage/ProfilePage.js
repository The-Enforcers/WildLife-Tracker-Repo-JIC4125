import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  TextField,
  Button,
  styled,
  CircularProgress,
  Pagination
} from "@mui/material";
import {
  DateRange,
  CameraAlt,
  Bookmark,
} from "@mui/icons-material";
import { UserContext } from "../../context/UserContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getPostsByAuthor,
  getUser,
  updateUserProfile,
} from "../../services/postService";

import ImageCard from "../../components/Card/Card";

// Keep existing styled components and theme...
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0),
  marginTop: theme.spacing(0),
  marginBottom: theme.spacing(0),
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(18),
  height: theme.spacing(18),
  marginBottom: theme.spacing(2),
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#12121208",
  padding: theme.spacing(2),
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams(); // Get id from URL
  const { user: currentUser } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState(null);
  const [value, setValue] = useState(0);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for bio and occupation editing
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const [isEditingOccupation, setIsEditingOccupation] = useState(false);
  const [occupationText, setOccupationText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 2
  });

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser?._id === id;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaveBio = async () => {
    if (!isOwnProfile) return;
    
    try {
      const updatedUser = await updateUserProfile(
        id,
        bioText,
        profileUser.occupation
      );
      setBioText(updatedUser.bio);
      setIsEditingBio(false);
      setProfileUser(prev => ({ ...prev, bio: updatedUser.bio }));
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleSaveOccupation = async () => {
    if (!isOwnProfile) return;

    try {
      const updatedUser = await updateUserProfile(
        id,
        profileUser.bio,
        occupationText
      );
      setOccupationText(updatedUser.occupation);
      setIsEditingOccupation(false);
      setProfileUser(prev => ({ ...prev, occupation: updatedUser.occupation }));
    } catch (error) {
      console.error("Error updating occupation:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {

      console.log("GETTING USER");
      setLoading(true);
      try {
        // Fetch user profile data
        const userData = await getUser(id);
        setProfileUser(userData);
        setBioText(userData.bio || "Wildlife Enthusiast");
        setOccupationText(userData.occupation || "Wildlife Enthusiast");

        // Fetch posts
        const postsResponse = await getPostsByAuthor(id, currentPage, 12);
        setPagination(postsResponse.pagination);
        setAuthorPosts(postsResponse.posts);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 404) {
          setAuthorPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profileUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{overflowY: "scroll", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",    
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3
          }}
        >
          <ProfileAvatar sx={{margin: "25px"}}
            alt={profileUser?.displayName || "User Avatar"}
            src={profileUser?.picture || "/placeholder.svg?height=200&width=200"}
          />
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <Typography variant="h5">
              {profileUser?.displayName || "Anonymous"}
            </Typography>

            <Typography
              variant="subtitle1"
              color="textSecondary"
              gutterBottom
            >
              {isEditingOccupation && isOwnProfile ? (
                <Box>
                  <TextField
                    fullWidth
                    value={occupationText}
                    onChange={(e) => setOccupationText(e.target.value)}
                    variant="outlined"
                    placeholder="Enter your occupation"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveOccupation}
                    >
                      Save
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => setIsEditingOccupation(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1">{profileUser.occupation}</Typography>
                  {isOwnProfile && (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => setIsEditingOccupation(true)}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              )}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <DateRange fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Member since:{" "}
                {profileUser?.createdAt
                  ? new Date(profileUser.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </Typography>
            </Box>
          </div>
        </Box>
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >
        {isEditingBio && isOwnProfile ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              variant="outlined"
              placeholder="Describe your passion for wildlife..."
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveBio}
              >
                Save
              </Button>
              <Button
                variant="text"
                color="secondary"
                onClick={() => setIsEditingBio(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#f0f4f9",
              padding: "15px",
              borderRadius: "15px",
              maxWidth: "50%"
            }}
          >
            <Typography>
              {profileUser?.bio || "..."}
              {isOwnProfile && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setIsEditingBio(true)}
                >
                  Edit
                </Button>
              )}
            </Typography>
          </div>
        )}
      </div>

      <Grid item xs={12} md={8} sx={{maxWidth: "2000px", margin: "0px auto"}}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", margin: "0px auto"}}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="profile tabs"
            centered
          >
            <Tab
              label={`Animal Profiles (${authorPosts.length})`}
              icon={<CameraAlt />}
              iconPosition="start"
            />
            {isOwnProfile && (<Tab
              label="Bookmarked Profiles (0)"
              icon={<Bookmark />}
              iconPosition="start"
            />)}
          </Tabs>
        </Box>

        {/* Rest of the component remains the same... */}
        {/* TabPanel and Grid components for displaying posts */}
        <TabPanel value={value} index={0}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Box sx={{ overflow: "auto" }}>
              <ThemeProvider theme={gridTheme}>
                <div className="animal-cards-box">
                  <div className="animal-cards-box-inner">
                      <Grid 
                        container 
                        spacing={2} 
                        sx={{
                          marginBottom: "200px",
                          maxWidth: "100%",
                        }}
                      >
                        {authorPosts.map((animal, index) => {
                          const itemCount = authorPosts.length;
                          let gridProps;

                          if (itemCount === 1) {
                            gridProps = { xs: 12, sm: 12, md: 12, lg: 12 };
                          } else if (itemCount === 2) {
                            gridProps = { xs: 12, sm: 6, md: 6, lg: 6 };
                          } else if (itemCount === 3) {
                            gridProps = { xs: 12, sm: 6, md: 4, lg: 4 };
                          } else {
                            gridProps = { xs: 12, sm: 6, md: 4, lg: 3 };
                          }

                          return (
                            <Grid item key={index} {...gridProps} sx={{ display: 'flex'}}>
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
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                  </div>
                </div>
              </ThemeProvider>

              <Box
                sx={{
                  width: "100%",
                  position: "absolute",
                  bottom: 50,
                  left: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "#f0f4f9",
                    borderRadius: "25px",
                    border: "1px solid lightgray",
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
                  />
                </Box>
              </Box>
            </Box>
          )}
        </TabPanel>
        {isOwnProfile && (<TabPanel value={value} index={1}>
          {/* Bookmarked profiles content */}
        </TabPanel>)}
      </Grid>
    </Box>
  );
}