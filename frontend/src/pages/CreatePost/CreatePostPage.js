import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/postService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  IconButton,
} from "@mui/material";

// MUI icons
import UploadIcon from "@mui/icons-material/Upload";
import Sidebar from "../../components/Sidebar/Sidebar";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [tracker, setTracker] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!title || !description) {
      setError("Both fields are required.");
      return;
    }

    const newPost = { title, tracker, description }; // Exclude image from the form data

    try {
      await createPost(newPost);
      navigate("/post");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <Container maxWidth="md" sx={{ marginTop: 4, paddingBottom: 6 }}>
        <Typography variant="h4" gutterBottom fontFamily={"monospace"}>
          New Post
        </Typography>
        <Grid container spacing={4}>
          {/* Left Side: Image Upload */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{
                backgroundColor: "#e0e0e0",
                borderRadius: "50%",
                width: 100,
                height: 100,
                "&:hover": {
                  backgroundColor: "#c0c0c0",
                },
              }}
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
              <UploadIcon sx={{ fontSize: 50 }} />
            </IconButton>

            {/* Display the selected image */}
            {image && (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
              >
                <img
                  src={image}
                  alt="Uploaded Preview"
                  style={{
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* Right Side: Form Fields */}
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                backgroundColor: "#f9f9f9",
                padding: 3,
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <TextField
                label="Animal"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                sx={{ borderRadius: "10px" }}
              />
              <TextField
                label="Tracker"
                variant="outlined"
                value={tracker}
                onChange={(e) => setTracker(e.target.value)}
                required
                fullWidth
                sx={{ borderRadius: "10px" }}
              />
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                fullWidth
                sx={{ borderRadius: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  borderRadius: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#3f51b5",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CreatePostPage;
