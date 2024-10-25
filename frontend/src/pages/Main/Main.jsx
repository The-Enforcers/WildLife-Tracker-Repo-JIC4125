import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";

const animalNames = ["Lion", "Tiger", "Elephant", "Giraffe", "Zebra"];

const Main = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const [input, setInput] = useState("");
  const [filters, setFilters] = useState({
    vhf: false,
    satellite: false,
    lora: false,
    acoustic: false,
    cell: false,
    bio: false,
    rfid: false,
    encapsulated: false,
    potting: false,
    shrink: false,
    hematic: false,
    harness: false,
    collar: false,
    adhesive: false,
    bolt: false,
    implant: false,
    mammal: false,
    reptile: false,
    amphibian: false,
    fish: false,
    bird: false,
  });

  // state variables for the typing animation
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("Animal");
  const [isDeleting, setIsDeleting] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  const searchFunc = useCallback(() => {
    const trackerTypes = [];
    const attachmentTypes = [];
    const enclosureTypes = [];
    const animalFamily = [];

    if (filters.vhf) trackerTypes.push("VHF");
    if (filters.satellite) trackerTypes.push("Satellite");
    if (filters.lora) trackerTypes.push("LoRa");
    if (filters.acoustic) trackerTypes.push("Acoustic");
    if (filters.cell) trackerTypes.push("Cellular / GSM");
    if (filters.bio) trackerTypes.push("Bio-logger");
    if (filters.rfid) trackerTypes.push("RFID");

    if (filters.encapsulated) enclosureTypes.push("Encapsulated");
    if (filters.potting) enclosureTypes.push("Potting");
    if (filters.shrink) enclosureTypes.push("Shrink wrap");
    if (filters.hematic) enclosureTypes.push("Hematic seal");

    if (filters.bolt) attachmentTypes.push("Bolt");
    if (filters.harness) attachmentTypes.push("Harness");
    if (filters.collar) attachmentTypes.push("Collar");
    if (filters.adhesive) attachmentTypes.push("Adhesive");
    if (filters.implant) attachmentTypes.push("Implant");

    if (filters.mammal) animalFamily.push("Mammal");
    if (filters.reptile) animalFamily.push("Reptile");
    if (filters.amphibian) animalFamily.push("Amphibians");
    if (filters.fish) animalFamily.push("Fish");
    if (filters.bird) animalFamily.push("Bird");

    // Construct query string
    const queryParams = new URLSearchParams();

    if (trackerTypes.length > 0) queryParams.append("trackerType", trackerTypes.join(","));
    if (attachmentTypes.length > 0) queryParams.append("attachmentType", attachmentTypes.join(","));
    if (enclosureTypes.length > 0) queryParams.append("enclosureType", enclosureTypes.join(","));
    if (animalFamily.length > 0) queryParams.append("animalType", animalFamily.join(","));
    if (input) queryParams.append("title", input);

    // Navigate to the search results page with query string
    navigate(`/results?${queryParams.toString()}`);
  }, [filters, input, navigate]);
  
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
          <div className="greet">
            <p className="sub-greet">
              Search Tracker Repository for{" "}
              <span className="animal-word">{displayedText}</span>
            </p>
          </div>
        <SearchBox input={input} setInput={setInput} onSearch={searchFunc} setFilters={setFilters}/>
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
