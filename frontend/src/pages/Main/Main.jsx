import React, { useState } from "react";

// CSS file
import "./Main.css";

// Importing MUI outlined icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

// Custom components
import SearchBox from "../../components/SearchBox/SearchBox";
import Sidebar from "../../components/Sidebar/Sidebar";


const Main = () => {
  const [input, setInput] = useState("");

  return (
    <>
    <Sidebar/>
    <div className="main">
      <div className="nav">
        <p>Wildlife Tracker</p>
        <a href="https://accounts.google.com/">
          <AccountCircleOutlinedIcon fontSize="large" />
        </a>
      </div>
      <div className="main-container">
        <div className="greet">
          <p>
            <span>Hello, Joe</span>
          </p>
          <p className="sub-greet">Search for animals or trackers</p>
        </div>

        {/* custom component */}
        <SearchBox input={input} setInput={setInput} />

        <div className="cards">
          <div className="card">
            <p>Draft an email with a packing list for an upcoming trip</p>
            <div className="card-icon">
              <LightbulbOutlinedIcon fontSize="large" />
            </div>
          </div>
          <div className="card">
            <p>Explain the following code step-by-step in detail</p>
            <div className="card-icon">
              <CodeOutlinedIcon fontSize="large" />
            </div>
          </div>
          <div className="card">
            <p>Help me get organized with a list of 10 tips</p>
            <div className="card-icon">
              <ExploreOutlinedIcon fontSize="large" />
            </div>
          </div>
          <div className="card">
            <p>Create an image & bedtime story</p>
            <div className="card-icon">
              <ImageOutlinedIcon fontSize="large" />
            </div>
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
