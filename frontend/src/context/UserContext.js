import React, { createContext, useState, useEffect } from "react";
import { useSnackbar } from "../components/SnackBar/SnackBar";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || null
  );
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
      setToken(newToken);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) {
        console.log("Token is not present. Calling fetchUser.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("https://localhost:5001/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });


        // Check if response has content
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const userData = await response.json();

          if (response.ok && userData && userData.googleId && userData.email) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            updateToken(storedToken);

            const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
            if (!hasSeenWelcome) {
              showSnackbar("Welcome!", "success");
              sessionStorage.setItem("hasSeenWelcome", "true");
            }
          } else if (response.status === 401 || response.status === 403) {
            setUser(null);
            // Only show the message if we're actually logged out
            if (user) {
              showSnackbar("Session expired. Please log in again.", "info");
            }
          }
        } else {
          console.log("Response was not JSON:", await response.text());
          if (response.status !== 204) {
            // Ignore empty success responses
            setUser(null);
            showSnackbar("Unable to verify authentication", "error");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Only show error message if it's not just a missing token
        if (storedToken) {
          showSnackbar("Error verifying authentication", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line
  }, [token, showSnackbar]);

  const logoutUser = async () => {
    try {
      const response = await fetch("https://localhost:5001/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      // Always clean up local state regardless of server response
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("hasSeenWelcome");

      if (response.ok) {
        showSnackbar("Logged out successfully!", "info");
      } else {
        console.error("Logout failed on server");
        showSnackbar("Logged out locally", "warning");
      }

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still clean up local state even if server request fails
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("hasSeenWelcome");
      showSnackbar("Logged out locally", "warning");
      navigate("/");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken: updateToken,
        logoutUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
