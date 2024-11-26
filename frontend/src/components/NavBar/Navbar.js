import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getBookmarkedPosts, unbookmarkPost } from "../../services/postService";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import GoogleIcon from "@mui/icons-material/Google";
import ClearIcon from "@mui/icons-material/Clear";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";

import "./Navbar.css";
import { useSnackbar } from "../SnackBar/SnackBar";

const Navbar = ({ breadcrumbs }) => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bookmarkAnchorEl, setBookmarkAnchorEl] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [profilePicError, setProfilePicError] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 900);
  const open = Boolean(anchorEl);
  const bookmarkOpen = Boolean(bookmarkAnchorEl);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
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
    navigate("/user/" + user._id);
  };

  const handleBookmarkClick = async (event) => {
    setBookmarkAnchorEl(event.currentTarget);
    if (user) {
      try {
        const bookmarks = await getBookmarkedPosts(user._id);
        setBookmarkedPosts(bookmarks);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      }
    }
  };

  const handleBookmarkClose = () => {
    setBookmarkAnchorEl(null);
  };

  const truncateText = (text, maxWords = 3) => {
    const words = text.split(" ");
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
  };

  const handleRemoveBookmark = async (postId) => {
    if (user) {
      try {
        await unbookmarkPost(user._id, postId);
        showSnackbar("Bookmark removed", "error");
        setBookmarkedPosts((prevBookmarks) =>
          prevBookmarks.filter((post) => post._id !== postId)
        );
      } catch (error) {
        console.error("Failed to remove bookmark:", error);
      }
    }
  };

  const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(18),
    height: theme.spacing(18),
  }));

  return (
    <div className="nav">
      <p>{isSmallScreen ? "Wildlife Institute" : "The Wildlife Movement Institute"}</p>
      {/* empty div used to replace space on smaller screens */}
      <div></div>
      <div className="breadcrumbs-container">
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBlock: 1, width: "100%" }}>
          {breadcrumbs.map((crumb, index) =>
            index < breadcrumbs.length - 1 ? (
              <Link
                key={crumb.path}
                to={crumb.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {crumb.name}
              </Link>
            ) : (
              <Typography key={crumb.path} color="text.primary">
                {crumb.name}
              </Typography>
            )
          )}
        </Breadcrumbs>
      </div>
      <div className="user-info">
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          {user && (
            <Tooltip title="Bookmarks">
              <IconButton
                onClick={handleBookmarkClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={bookmarkOpen ? "bookmark-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={bookmarkOpen ? "true" : undefined}
              >
                <BookmarkBorderIcon sx={{ fontSize: 30, color: "black", mt: "1px" }} />
              </IconButton>
            </Tooltip>
          )}
          {user ? (
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                {!profilePicError && user.picture ? (
                  <ProfileAvatar
                    src={user.picture}
                    alt={user?.displayName || "User Avatar"}
                    sx={{ width: 32, height: 32, bgcolor: "white" }}
                    onError={() => setProfilePicError(true)}
                  />
                ) : (
                  <AccountCircleOutlinedIcon
                    sx={{ fontSize: 35, color: "black", borderRadius: "50%" }}
                  />
                )}
              </IconButton>
            </Tooltip>
          ) : (
            <button
              onClick={() =>
                (window.location.href = "https://localhost:5001/auth/google")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: "#212e38",
                border: "none",
                color: "white",
                cursor: "pointer",
                margin: "8px",
              }}
            >
              <GoogleIcon style={{ marginRight: "8px" }} />
              Sign In
            </button>
          )}
        </Box>

        {/* Bookmark Menu */}
        <Menu
          anchorEl={bookmarkAnchorEl}
          id="bookmark-menu"
          open={bookmarkOpen}
          onClose={handleBookmarkClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "auto",
              width: 220,
              maxWidth: 220,
              maxHeight: 215,
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((post) => (
              <MenuItem
                key={post._id}
                onClick={() => {
                  handleBookmarkClose();
                  navigate(`/posts/${post._id}`);
                }}
              >
                <Avatar
                  src={`https://${window.location.hostname}:5001/api/posts/image/${post.postImage}`}
                  alt={post.animalType}
                  sx={{ width: 32, height: 32, marginRight: 1 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <Typography variant="body2">
                    {truncateText(post.title)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {truncateText(post.animalType)}
                  </Typography>
                </Box>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBookmark(post._id);
                  }}
                >
                  <ClearIcon fontSize="small" sx={{ color: "black" }} />
                </IconButton>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No bookmarks found</MenuItem>
          )}
        </Menu>

        {/* Profile Menu */}
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
              key="login"
              onClick={() =>
                (window.location.href = "https://localhost:5001/auth/google")
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
  );
};

export default Navbar;
