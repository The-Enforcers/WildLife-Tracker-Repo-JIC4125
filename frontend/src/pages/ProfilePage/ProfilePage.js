import React, { useState } from "react";
import {
  Avatar,
  Box,
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

import Sidebar from "../../components/Sidebar/Sidebar";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(6),
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
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
                  alt="Jane Doe"
                  src="/placeholder.svg?height=200&width=200"
                />
                <Typography variant="h5">Jane Doe</Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Wildlife Enthusiast
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <LocationOn fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Atlanta, Georgia</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <DateRange fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Member since: Sep 2024
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
                  <List>
                    {[
                      {
                        name: "Animal 1",
                        location: "Lamar Valley",
                        date: "2023-06-15",
                      },
                      {
                        name: "Animal 2",
                        location: "Hayden Valley",
                        date: "2023-06-10",
                      },
                      {
                        name: "Animal 3",
                        location: "Yellowstone Lake",
                        date: "2023-06-05",
                      },
                      {
                        name: "Animal 4 ",
                        location: "Old Faithful",
                        date: "2023-05-30",
                      },
                    ].map((sighting, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar
                            src={`/placeholder.svg?height=40&width=40&text=${sighting.name}`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={sighting.name}
                          secondary={`${sighting.location} - ${sighting.date}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </TabPanel>
              </Grid>
            </Grid>
          </StyledPaper>
        </Container>
      </Box>
    </>
  );
}
