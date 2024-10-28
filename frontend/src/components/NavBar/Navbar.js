import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

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
  styled,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePicError, setProfilePicError] = useState(false);
  const open = Boolean(anchorEl);

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
    navigate("/profile");
  };
  const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(18),
    height: theme.spacing(18),
  }));

  return (
    <div className="nav">
      <p>Wildlife Tracker</p>
      <div className="user-info">
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
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
              {user ? (
                // Show profile picture or placeholder image if logged in
                <ProfileAvatar
                  src={
                    !profilePicError && user.picture
                      ? user.picture
                      : "https://via.placeholder.com/150"
                  }
                  alt={user?.displayName || "User Avatar"}
                  sx={{ width: 32, height: 32, bgcolor: "white" }}
                  onError={() => setProfilePicError(true)} // Handle image load error
                />
              ) : (
                // Show AccountCircleOutlinedIcon if not logged in
                <AccountCircleOutlinedIcon
                  sx={{ fontSize: 35, color: "black", borderRadius: "50%" }}
                />
              )}
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
