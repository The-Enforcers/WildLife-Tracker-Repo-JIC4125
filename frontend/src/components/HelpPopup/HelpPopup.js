import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./HelpPopup.css";

const HelpPopup = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return createPortal(
    <div className="help-popup-overlay">
      <div className="help-popup-content">
        <h2>Welcome to Our Platform!</h2>
        <p>Here's a quick guide on how to use our platform:</p>
        <ul>
          <li>Use the sidebar to navigate between different sections.</li>
          <li>Click on "New Animal Profile" to create a new entry.</li>
          <li>View all your posts by clicking on "View Animal Profiles".</li>
        </ul>
        <p>
          If you need further assistance, don't hesitate to contact our support
          team!
        </p>
        <button onClick={onClose}>Next</button>
      </div>
    </div>,
    document.body
  );
};

export default HelpPopup;
