import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Card,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
  styled,
} from "@mui/material";
import {
  LocationOn,
  DateRange,
  Pets,
  CameraAlt,
  Favorite,
} from "@mui/icons-material";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import axios from "axios"; // Axios for API calls

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
  const [value, setValue] = useState(0);
  const { user } = useContext(UserContext); // Access user from UserContext
  const [authorPosts, setAuthorPosts] = useState([]); // State to store author's posts
  const [loading, setLoading] = useState(true); // State for loading

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Fetch posts by the author when the component mounts
  useEffect(() => {
    const fetchAuthorPosts = async () => {
      if (user && user.googleId) {
        try {
          const response = await axios.get(
            `https://${window.location.hostname}:5001/api/posts/author/${user.googleId}`
          );
          setAuthorPosts(response.data);
        } catch (error) {
          console.error("Error fetching author posts:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAuthorPosts();
  }, [user]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ margin: 1 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Home
        </Link>
        <Typography color="text.primary">Profile</Typography>
      </Breadcrumbs>
      <Container maxWidth="lg">
        <StyledPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={4}
              mt={8}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ProfileAvatar
                alt={user?.displayName || "User Avatar"}
                src={user?.picture || "/placeholder.svg?height=200&width=200"}
              />
              <Typography variant="h5">
                {user?.displayName || "Anonymous"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                {user?.bio || "Wildlife Enthusiast"}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <LocationOn fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {user?.location || "Unknown Location"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <DateRange fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Member since: {user?.memberSince || "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="profile tabs"
                >
                  <Tab label="About" icon={<Pets />} iconPosition="start" />
                  <Tab
                    label="Recent Posts"
                    icon={<CameraAlt />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <StatsCard>
                      <Typography variant="h4">1,234</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Total Posts
                      </Typography>
                    </StatsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatsCard>
                      <Typography variant="h4">56</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Species Spotted
                      </Typography>
                    </StatsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StatsCard>
                      <Typography variant="h4">789</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Photos Uploaded
                      </Typography>
                    </StatsCard>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <StatsCard>
                    <Typography variant="body1">
                      Passionate wildlife enthusiast with a keen eye for rare
                      species. I've been tracking and documenting wildlife
                      across North America for over 5 years.
                    </Typography>
                  </StatsCard>
                </Box>
                <br />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {[
                    "River Otter",
                    "Grizzly Bear",
                    "Bald Eagle",
                    "Frog",
                    "American Bison",
                    "Elk",
                    "Moose",
                    "Mountain Lion",
                    "Beaver",
                  ].map((species) => (
                    <Chip
                      key={species}
                      label={species}
                      icon={<Favorite />}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1}>
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                    {" "}
                    {/* Set height and enable scrolling */}
                    <List>
                      {authorPosts.map((post) => (
                        <ListItem
                          key={post._id}
                          component={Link}
                          to={`/post/${post._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={`https://${window.location.hostname}:5001/api/posts/image/${post.postImage}`}
                              alt={post.title}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={post.title}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {post.commonName}
                                </Typography>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {` • ${new Date(
                                    post.date
                                  ).toLocaleDateString()}`}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </TabPanel>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>
    </Box>
  );
}
