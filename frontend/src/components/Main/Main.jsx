import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

// CSS file
import "./Main.css";

// Importing MUI outlined icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import SendIcon from '@mui/icons-material/Send';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const Main = () => {
  const [input, setInput] = useState("");

  return (
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

        <div className="search-box">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Enter an animal or species"
          />
          <div>
            <span>
              <PhotoOutlinedIcon
                data-tooltip-id="upload-image"
                data-tooltip-content="Upload image"
                fontSize="medium"
              />
              <Tooltip
                id="upload-image"
                style={{
                  padding: "5px",
                  fontSize: "12px",
                  color: "#f0f4f9",
                }}
              />
            </span>

            {input.length > 0 && (
              <span className={`send-icon ${input.length > 0 ? "show" : ""}`}>
                <SendIcon
                  onClick={console.log('sent!')}
                  data-tooltip-id="submit"
                  data-tooltip-content="Submit"
                  fontSize="medium"
                />
                <Tooltip
                  id="submit"
                  style={{
                    padding: "5px",
                    fontSize: "12px",
                    color: "#f0f4f9",
                  }}
                />
              </span>
            )}
          </div>
        </div>

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
  );
};

export default Main;
