import React, { useState, useEffect } from "react";

// CSS file
import "./Main.css";

// Importing MUI outlined icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

// Custom components
import SearchBox from "../../components/SearchBox/SearchBox";
import Sidebar from "../../components/Sidebar/Sidebar";

// Local icon images
import icon1 from "../../assets/Mammals.png";
import icon4 from "../../assets/Birds.png";
import icon3 from "../../assets/Amphibians.png";
import icon2 from "../../assets/Reptiles.png";
import icon5 from "../../assets/Fish.png";

const Main = () => {
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://localhost:5001/api/user', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="main">
        <div className="nav">
          <p>Wildlife Tracker</p>
          {user ? (
            <span>{user.displayName}</span>
          ) : (
            <a href="https://localhost:5001/auth/google">
              <AccountCircleOutlinedIcon
                fontSize="large"
                sx={{ color: "black" }}
              />
            </a>
          )}
        </div>
        <div className="main-container">
          {user && (
            <div className="greet">
              <p>
                <span>Hello, {user.displayName}</span>
              </p>
              <p className="sub-greet">Search Animal Tracker Repository</p>
            </div>
          )}

          {/* Search Box */}
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