import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// User context for user information
import { UserContext } from "../../context/UserContext"; 

// CSS file
import "./Main.css";

// Importing MUI components and icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";

// Custom components
import SearchBox from "../../components/SearchBox/SearchBox";
import Sidebar from "../../components/Sidebar/Sidebar";

// Local icon images
import icon1 from "../../assets/Mammals.png";
import icon4 from "../../assets/Birds.png";
import icon3 from "../../assets/Amphibians.png";
import icon2 from "../../assets/Reptiles.png";
import icon5 from "../../assets/Fish.png";

const animalNames = ["Lion", "Tiger", "Elephant", "Giraffe", "Zebra"];

const Main = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext); // Get user and logout function from context

  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // state variables for the typing animation
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("Animal");
  const [isDeleting, setIsDeleting] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
      setDisplayedText("");
      setCurrentAnimalIndex(0);
    }, 1500); // delay the typing animations

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animationStarted) return;

    const currentAnimal = animalNames[currentAnimalIndex % animalNames.length];

    if (!isDeleting && displayedText.length < currentAnimal.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentAnimal.substring(0, displayedText.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && displayedText.length === currentAnimal.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayedText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentAnimal.substring(0, displayedText.length - 1));
      }, 75);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setCurrentAnimalIndex((c) => c + 1);
    }
  }, [displayedText, isDeleting, animationStarted, currentAnimalIndex]);

  const handleLogout = async () => {
    await logoutUser(); // calls the logout function from context
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate("/profile");
  };

  return (
    <>
      <Sidebar />
      <div className="main">
        <div className="nav">
          <p>Wildlife Tracker</p>
          <div className="user-info">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    src={user?.picture || ""}
                    alt={user?.displayName || "User Avatar"}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "white",
                    }}
                  >
                    {!user?.picture && (
                      <AccountCircleOutlinedIcon
                        sx={{
                          fontSize: 35,
                          color: "black",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 22,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {user ? (
                [
                  <MenuItem key="profile" onClick={handleProfileClick}>
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon fontSize="medium" />
                    </ListItemIcon>
                    {user.displayName}
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem key="logout" onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>,
                ]
              ) : (
                <MenuItem
                  onClick={() =>
                    (window.location.href =
                      "https://localhost:5001/auth/google")
                  }
                >
                  <ListItemIcon>
                    <GoogleIcon fontSize="small" />
                  </ListItemIcon>
                  Sign In with Google
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>

        <div className="main-container">
          {user && (
            <div className="greet">
              <p>
                <span>Hello, {user.displayName}</span>
              </p>
              <p className="sub-greet">
                Tracker Repository for{" "}
                <span className="animal-word">{displayedText}</span>
              </p>
            </div>
          )}

          <SearchBox input={input} setInput={setInput} />

          {/* Icon Images with Labels */}
          <div className="icon-images">
            <div className="icon-wrapper">
              <img src={icon1} alt="Mammals Icon" className="icon-image" />
              <p className="icon-label">Mammals</p>
            </div>
            <div className="icon-wrapper">
              <img src={icon2} alt="Reptiles Icon" className="icon-image" />
              <p className="icon-label">Reptiles</p>
            </div>
            <div className="icon-wrapper">
              <img src={icon3} alt="Amphibians Icon" className="icon-image" />
              <p className="icon-label">Amphibians</p>
            </div>
            <div className="icon-wrapper">
              <img src={icon5} alt="Fish Icon" className="icon-image" />
              <p className="icon-label">Fish</p>
            </div>
            <div className="icon-wrapper">
              <img src={icon4} alt="Birds Icon" className="icon-image" />
              <p className="icon-label">Birds</p>
            </div>
          </div>

          <div className="main-bottom">
            <p className="bottom-info">Developed by Georgia Tech Students</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
