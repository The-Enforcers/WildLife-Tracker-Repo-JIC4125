import React, { createContext, useState, useEffect } from "react";
import { useSnackbar } from "../components/SnackBar/SnackBar";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
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

          if (userData && userData.googleId && userData.email) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
            if (!hasSeenWelcome) {
              showSnackbar("Welcome!", "success");
              sessionStorage.setItem("hasSeenWelcome", "true");
            }
          } else {
            setUser(null);
            localStorage.removeItem("user");
            showSnackbar("Login failed: Invalid user data", "error");
          }
        } else if (response.status === 401 || response.status === 403) {
          setUser(null);
          localStorage.removeItem("user");
          showSnackbar("Please log in to continue.", "info");
        } else {
          setUser(null);
          localStorage.removeItem("user");
          showSnackbar("Error retrieving user data", "error");
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [showSnackbar, navigate]);

  const logoutUser = async () => {
    try {
      const response = await fetch("https://localhost:5001/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        localStorage.removeItem("user");
        showSnackbar("Logged out!", "info");
        sessionStorage.removeItem("hasSeenWelcome");
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
