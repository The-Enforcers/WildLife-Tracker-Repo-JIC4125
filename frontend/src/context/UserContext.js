// UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://localhost:5001/api/user", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        setUser(null);
        console.log("User: not logged in");
      }
    };

    fetchUser();
  }, []);

  const logoutUser = async () => {
    try {
      const response = await fetch("https://localhost:5001/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
