import React, { useState } from "react";
import "./Main.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

// Importing MUI outlined icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const Main = () => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const onSent = () => {
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    // Simulating async behavior for result data
    setTimeout(() => {
      setLoading(false);
      setResultData("This is the response from the prompt.");
    }, 2000);
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Wildlife Tracker</p>
        <a href="https://accounts.google.com/">
          <AccountCircleOutlinedIcon fontSize="large" />
        </a>
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Joe</span>
              </p>
              <p className="sub-greet">Search for animals or tracker</p>
            </div>

            <div className="search-box">
              <input
                onKeyDown={(e) => {
                  if (input && e.key === "Enter") {
                    onSent();
                  }
                }}
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                placeholder="Enter a prompt here"
              />
              <div>
                <span>
                  <PhotoOutlinedIcon
                    data-tooltip-id="upload-image"
                    data-tooltip-content="Upload image"
                    fontSize="large"
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
                    <SendOutlinedIcon
                      onClick={onSent}
                      data-tooltip-id="submit"
                      data-tooltip-content="Submit"
                      fontSize="large"
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
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <AccountCircleOutlinedIcon fontSize="large" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p
                  style={{ marginTop: "0px" }}
                  dangerouslySetInnerHTML={{ __html: resultData }}
                ></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <p className="bottom-info">Developed by Georgia Tech Students</p>
        </div>
      </div>
    </div>
  );
};

export default Main;
