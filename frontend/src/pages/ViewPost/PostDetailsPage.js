import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import ImageCard from "../../components/Card/Card"; // Adjust the path to your actual ImageCard component
import Sidebar from "../../components/Sidebar/Sidebar"; // Adjust path
import SearchBox from "../../components/SearchBox/SearchBox"; // Adjust path

const PostPage = () => {
  const [input, setInput] = useState("");
  const [animals, setAnimals] = useState([]); // State to hold data from MongoDB

  // Fetch data from the MongoDB backend
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/posts");
        const data = await response.json();
        console.log(data);
        setAnimals(data); // Assuming data is an array of animals
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAnimals();
  }, []); // Empty dependency array means it runs once when the component mounts

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <Sidebar />

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {/* SearchBox */}
        <Box sx={{ padding: 2 }}>
          <SearchBox input={input} setInput={setInput} />
        </Box>

        {/* Video Grid */}
        <Box sx={{ flexGrow: 1, padding: 2, overflowY: "auto" }}>
          <Container>
            <Grid container spacing={2}>
              {animals.map((animal, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <ImageCard
                    title={animal.title} // Title from MongoDB
                    description={animal.description} // Description from MongoDB
                    image={
                      "https://plus.unsplash.com/premium_photo-1675432656807-216d786dd468?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    } // Placeholder image
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

export default PostPage;
