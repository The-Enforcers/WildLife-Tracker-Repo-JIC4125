import React, { useState } from 'react';
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
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import Sidebar from "../../components/Sidebar/Sidebar";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

const dataTypeOptions = ["Accelerometry", "Body Temperature", "Environmental Temperature", "Heart Rate"];

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [trackerType, setTrackerType] = useState("");
  const [customTrackerType, setCustomTrackerType] = useState("");
  const [dataTypes, setDataTypes] = useState([]);
  const [enclosureType, setEnclosureType] = useState("");
  const [customEnclosureType, setCustomEnclosureType] = useState("");
  const [attachmentType, setAttachmentType] = useState("");
  const [customAttachmentType, setCustomAttachmentType] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [image, setImage] = useState(null);
  // eslint-disable-next-line 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEditorChange = ({ text }) => {
    setRecommendations(text);
  };

  const handleDataTypeToggle = (dataType) => {
    setDataTypes(prev => 
      prev.includes(dataType) 
        ? prev.filter(type => type !== dataType)
        : [...prev, dataType]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scientificName || !commonName || !recommendations) {
      setError("All fields are required.");
      return;
    }

    const newPost = {
      title,
      scientificName,
      commonName,
      animalType,
      trackerType: trackerType === 'custom' ? customTrackerType : trackerType,
      dataTypes,
      enclosureType: enclosureType === 'custom' ? customEnclosureType : enclosureType,
      attachmentType: attachmentType === 'custom' ? customAttachmentType : attachmentType,
      recommendations
    };

    try {
      await createPost(newPost);
      navigate("/results");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <Container maxWidth="lg" sx={{ marginTop: 4, paddingBottom: 6 }}>
        <Typography variant="h4" gutterBottom fontFamily={"monospace"}>
          New Animal Profile
        </Typography>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{
                      backgroundColor: "#e0e0e0",
                      width: 100,
                      height: 100,
                      marginBottom: 2,
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
                  {image && (
                    <img
                      src={image}
                      alt="Uploaded Preview"
                      style={{
                        maxHeight: 200,
                        maxWidth: '100%',
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </Box>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Post Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Scientific Name"
                  variant="outlined"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Common Name(s)"
                  variant="outlined"
                  value={commonName}
                  onChange={(e) => setCommonName(e.target.value)}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Animal Type</InputLabel>
                  <Select
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value)}
                    label="Animal Type"
                    required
                  >
                    <MenuItem value="Mammal">Mammal</MenuItem>
                    <MenuItem value="Reptile">Reptile</MenuItem>
                    <MenuItem value="Amphibian">Amphibian</MenuItem>
                    <MenuItem value="Fish">Fish</MenuItem>
                    <MenuItem value="Bird">Bird</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Tracker Type</InputLabel>
                  <Select
                    value={trackerType}
                    onChange={(e) => setTrackerType(e.target.value)}
                    label="Tracker Type"
                    required
                  >
                    <MenuItem value="VHF">VHF</MenuItem>
                    <MenuItem value="GPS">GPS</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
                {trackerType === 'custom' && (
                  <TextField
                    label="Custom Tracker Type"
                    variant="outlined"
                    value={customTrackerType}
                    onChange={(e) => setCustomTrackerType(e.target.value)}
                    required
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                )}
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Enclosure Type</InputLabel>
                  <Select
                    value={enclosureType}
                    onChange={(e) => setEnclosureType(e.target.value)}
                    label="Enclosure Type"
                    required
                  >
                    <MenuItem value="Encapsulated">Encapsulated</MenuItem>
                    <MenuItem value="Modular">Modular</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
                {enclosureType === 'custom' && (
                  <TextField
                    label="Custom Enclosure Type"
                    variant="outlined"
                    value={customEnclosureType}
                    onChange={(e) => setCustomEnclosureType(e.target.value)}
                    required
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                )}
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Attachment Type</InputLabel>
                  <Select
                    value={attachmentType}
                    onChange={(e) => setAttachmentType(e.target.value)}
                    label="Attachment Type"
                    required
                  >
                    <MenuItem value="Harness">Harness</MenuItem>
                    <MenuItem value="Collar">Collar</MenuItem>
                    <MenuItem value="Glue-on">Glue-on</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
                {attachmentType === 'custom' && (
                  <TextField
                    label="Custom Attachment Type"
                    variant="outlined"
                    value={customAttachmentType}
                    onChange={(e) => setCustomAttachmentType(e.target.value)}
                    required
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                )}
              </Grid>

              {/* Data Types */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Data Types:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dataTypeOptions.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      onClick={() => handleDataTypeToggle(option)}
                      color={dataTypes.includes(option) ? "primary" : "default"}
                      sx={{ marginBottom: 1 }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Recommendations */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Recommendations:</Typography>
                <MdEditor
                  style={{ height: '300px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreatePostPage;