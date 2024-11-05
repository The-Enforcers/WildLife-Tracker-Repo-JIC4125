import React, { createContext, useState, useEffect } from "react";
import { useSnackbar } from "../components/SnackBar/SnackBar";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null); // Initialize token from localStorage
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://localhost:5001/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
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
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            showSnackbar("Login failed: Invalid user data", "error");
          }
        } else if (response.status === 401 || response.status === 403) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
          showSnackbar("Please log in to continue.", "info");
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
          showSnackbar("Error retrieving user data", "error");
        }
      } catch (error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      console.log("Token is present. Calling fetchUser.");
      fetchUser();
    } else {
      console.log("Token is not present. Calling fetchUser.");
      setLoading(false);
    }
  }, [token, showSnackbar, navigate]);

  const logoutUser = async () => {
    try {
      const response = await fetch("https://localhost:5001/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
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
    <UserContext.Provider value={{ user, setUser, token, setToken, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
