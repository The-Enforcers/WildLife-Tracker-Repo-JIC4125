import React, { createContext, useState, useEffect } from "react";
import { useSnackbar } from "../components/SnackBar/SnackBar";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://localhost:5001/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // Check if the welcome message has already been shown during the session
          const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");

          if (!hasSeenWelcome) {
            showSnackbar("Welcome!", "success");
            sessionStorage.setItem("hasSeenWelcome", "true");
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.log("User: not logged in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [showSnackbar]);

  const logoutUser = async () => {
    try {
      const response = await fetch("https://localhost:5001/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        showSnackbar("Logged out!", "info");
        sessionStorage.removeItem("hasSeenWelcome");

        // Navigate to home after logout
        navigate("/");
      } else {
        console.error("Logout failed");
        showSnackbar("Logout failed!", "error");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
