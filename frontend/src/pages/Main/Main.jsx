import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

import { searchPosts } from "../../services/postService"; // Import searchPosts
import CircularProgress from "@mui/material/CircularProgress"; // Import MUI spinner

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

const animalNames = [
  "Deer",
  "Tortoises",
  "Ducks",
  "Rabbits",
  "Sea Turtles",
  "Frogs",
];

const Main = () => {
  const [input, setInput] = useState("");
  // state variables for the typing animation
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("Animal");
  const [isDeleting, setIsDeleting] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    mammal: false,
    reptile: false,
    amphibian: false,
    fish: false,
    bird: false,
  });

  const searchFunc = useCallback(() => {
    const animalFamily = [];
    if (filters.mammal) animalFamily.push("Mammal");
    if (filters.reptile) animalFamily.push("Reptile");
    if (filters.amphibian) animalFamily.push("Amphibians");
    if (filters.fish) animalFamily.push("Fish");
    if (filters.bird) animalFamily.push("Bird");

    const queryParams = new URLSearchParams();
    if (animalFamily.length > 0)
      queryParams.append("animalType", animalFamily.join(","));
    if (input) queryParams.append("search", input);

    // Navigate to the search results page with query string
    navigate(`/posts?${queryParams.toString()}`);
  }, [filters, input, navigate]);

  const handleAnimalClick = (animal) => {
    setFilters({
      mammal: animal === "mammal",
      reptile: animal === "reptile",
      amphibian: animal === "amphibian",
      fish: animal === "fish",
      bird: animal === "bird",
    });
    navigate(`/posts?search=&${animal}=true`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
      setDisplayedText("");
      setCurrentAnimalIndex(0);
    }, 1500); // delay the typing animations

    return () => clearTimeout(timer);
  }, []);

  // Define the base URL for image API (adjust this based on your server configuration)
  const imageApiBaseUrl = "https://localhost:5001/api/posts/image/";

  const handleSearch = async (searchTerm) => {
    try {
      const results = await searchPosts(searchTerm); // Use searchPosts from postService
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

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

  useEffect(() => {
    if (input.length > 1) {
      handleSearch(input);
    } else {
      setSearchResults([]);
    }
  }, [input]);

  const handleImageLoad = (id) => {
    setLoadingImages((prevLoadingImages) => ({
      ...prevLoadingImages,
      [id]: false, // Image has loaded
    }));
  };

  const handleImageError = (id) => {
    setLoadingImages((prevLoadingImages) => ({
      ...prevLoadingImages,
      [id]: false, // Handle error state if needed
    }));
  };

  const handleImageLoading = (id) => {
    setLoadingImages((prevLoadingImages) => ({
      ...prevLoadingImages,
      [id]: true, // Image is loading
    }));
  };

  // Function to navigate to the post details page
  const navigateToPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleIconSearchFilter = (animalType) => {

    // Construct query string
    const queryParams = new URLSearchParams();

    if (animalType.length > 0) queryParams.append(animalType, true);
    if (input) queryParams.append("search", input);

    // Navigate to the search results page with query string
    navigate(`/posts?${queryParams.toString()}`);
  };

  return (
    <div className="greet-container">
      <div className="greet">
        <p className="sub-greet">
          Search Tracker Repository for{" "}
          <span className="animal-word">{displayedText}</span>
        </p>
      </div>

      <SearchBox
        input={input}
        setInput={setInput}
        onSearch={searchFunc}
        setFilters={setFilters}
      />

      {/* Display search results */}
      {input && (
        <div className="search-results-container">
          {searchResults.length > 0 ? (
            searchResults.map((post) => (
              <div
                key={post._id}
                className="search-result-item"
                onClick={() => navigateToPost(post._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="post-details">
                  <h3>{post.title}</h3>
                  <p>
                    <strong>Common Name:</strong> {post.commonName}
                  </p>
                  <p>
                    <strong>Tracker Type:</strong> {post.trackerType}
                  </p>
                </div>

                {/* Image loading state handling */}
                {loadingImages[post._id] && (
                  <div className="spinner-container">
                    <CircularProgress size={24} />
                  </div>
                )}

                <img
                  src={`${imageApiBaseUrl}${post.postImage}`}
                  alt={post.title}
                  className="post-images"
                  onLoad={() => handleImageLoad(post._id)}
                  onError={() => handleImageError(post._id)}
                  onLoadStart={() => handleImageLoading(post._id)}
                  style={{
                    display: loadingImages[post._id] ? "none" : "block", // Hide image while loading
                  }}
                />
              </div>
            ))
          ) : (
            <p className="no-results">No results found</p>
          )}
        </div>
      )}

      {/* Icon Images with Labels */}
      {searchResults.length === 0 ? (
        <div>
          <div className="icon-images">
            <div
              className="icon-wrapper"
              onClick={() => handleAnimalClick("mammal")}
            >
              <img src={icon1} alt="Mammals Icon" className="icon-image" />
              <p className="icon-label">Mammals</p>
            </div>
            <div
              className="icon-wrapper"
              onClick={() => handleAnimalClick("reptile")}
            >
              <img src={icon2} alt="Reptiles Icon" className="icon-image" />
              <p className="icon-label">Reptiles</p>
            </div>
            <div
              className="icon-wrapper"
              onClick={() => handleAnimalClick("amphibian")}
            >
              <img src={icon3} alt="Amphibians Icon" className="icon-image" />
              <p className="icon-label">Amphibians</p>
            </div>
            <div
              className="icon-wrapper"
              onClick={() => handleAnimalClick("fish")}
            >
              <img src={icon5} alt="Fish Icon" className="icon-image" />
              <p className="icon-label">Fish</p>
            </div>
            <div
              className="icon-wrapper"
              onClick={() => handleAnimalClick("bird")}
            >
              <img src={icon4} alt="Birds Icon" className="icon-image" />
              <p className="icon-label">Birds</p>
            </div>
          </div>

          <div className="main-bottom">
            <p className="bottom-info">Developed by Georgia Tech Students</p>
          </div>
        </div>
      ) : (
        <br />
      )}
    </div>
  );
};

export default Main;
