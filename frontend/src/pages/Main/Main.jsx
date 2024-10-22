import React, { useState, useEffect, useContext } from "react";
// User context for user information
import { UserContext } from "../../context/UserContext";

// CSS file
import "./Main.css";

// Custom components
import SearchBox from "../../components/SearchBox/SearchBox";

// Local icon image assets
import icon1 from "../../assets/Mammals.png";
import icon4 from "../../assets/Birds.png";
import icon3 from "../../assets/Amphibians.png";
import icon2 from "../../assets/Reptiles.png";
import icon5 from "../../assets/Fish.png";

const animalNames = ["Lion", "Tiger", "Elephant", "Giraffe", "Zebra"];

const Main = () => {
  const { user } = useContext(UserContext);

  const [input, setInput] = useState("");

  // state variables for the typing animation
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("Animal");
  const [isDeleting, setIsDeleting] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
      setDisplayedText("");
      setCurrentAnimalIndex(0);
    }, 1500); // delay the typing animations

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animationStarted) return;

    const currentAnimal = animalNames[currentAnimalIndex % animalNames.length];

    if (!isDeleting && displayedText.length < currentAnimal.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentAnimal.substring(0, displayedText.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && displayedText.length === currentAnimal.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayedText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentAnimal.substring(0, displayedText.length - 1));
      }, 75);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setCurrentAnimalIndex((c) => c + 1);
    }
  }, [displayedText, isDeleting, animationStarted, currentAnimalIndex]);

  return (
      <div className="greet-container">
        {user && (
          <div className="greet">
            <p>
              <span>Hello, {user.displayName}</span>
            </p>
            <p className="sub-greet">
              Tracker Repository for{" "}
              <span className="animal-word">{displayedText}</span>
            </p>
          </div>
        )}

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
  );
};

export default Main;
