import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImageCard from "../../components/Card/Card"; 
import Sidebar from "../../components/Sidebar/Sidebar";
import SearchBox from "../../components/SearchBox/SearchBox";

const SearchResults = () => {
  const [input, setInput] = useState("");
  const [animals, setAnimals] = useState([]); 

  const imageUrls = [
    "https://plus.unsplash.com/premium_photo-1675432656807-216d786dd468?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675714692711-d1aac0262feb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673455210376-fb94ce182ff4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661936536518-4c6fa37f5ba8?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661940855582-ccfec6edbf51?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  // fetch data from the MongoDB backend
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/posts");
        const data = await response.json();
        console.log(data);
        setAnimals(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAnimals();
  }, []);

  // Function to pick a random image from the imageUrls array
  const getRandomImage = () => {
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <Sidebar />

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {/* SearchBox */}
        <Box sx={{ padding: 2 }}>
          <SearchBox input={input} setInput={setInput} />
        </Box>

        {/* Grid */}
        <Box sx={{ flexGrow: 1, padding: 2, overflowY: "auto" }}>
          <Container>
            <Grid container spacing={2}>
              {animals.map((animal, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <ImageCard
                    title={animal.title} // title from MongoDB
                    description={animal.tracker} // description from MongoDB
                    post_id={animal._id} // Post id from MongoDB
                    image={getRandomImage()} // randomly selected image
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResults``;
