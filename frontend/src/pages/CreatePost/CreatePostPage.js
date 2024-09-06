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
import UploadIcon from "@mui/icons-material/Upload"; // MUI upload icon
import Sidebar from "../../components/Sidebar/Sidebar";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
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

    const newPost = { title, description }; // Exclude image from the form data

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
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create a New Post
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
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
              <UploadIcon sx={{ fontSize: 80 }} />
            </IconButton>

            {/* Display the selected image */}
            {image && (
              <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
              >
                <img
                  src={image}
                  alt="Uploaded Preview"
                  style={{ maxHeight: 200, objectFit: "contain" }}
                />
              </Box>
            )}
          </Grid>

          {/* Right Side: Form Fields */}
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" type="submit">
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
