import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/postService";
import { uploadImage } from "../../services/postService";
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
import { Edit as EditIcon } from '@mui/icons-material';


const mdParser = new MarkdownIt();

const dataTypeOptions = ["Accelerometry", "Body Temperature", "Environmental Temperature", "Heart Rate","Ambient Temperature","Pressure (air or water)"];


const MainImageUploadArea = ({ type, image, handleImageChange }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 200 }}>
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
      <IconButton
        color="primary"
        aria-label="upload picture"
        component="label"
        sx={{
          position: 'absolute',
          bottom: 10, // Adjust positioning as needed
          right: 10,  // Adjust positioning as needed
          backgroundColor: "#e0e0e0",
          width: 50,
          height: 50,
          "&:hover": {
            backgroundColor: "#c0c0c0",
          },
        }}
      >
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={(e) => handleImageChange(type, e)} 
        />
        <UploadIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </Box>
  </Box>
);

const ImageUploadArea = ({ type, image, handleImageChange }) => (
  <Grid item xs={2} container alignItems="center" justifyContent="flex-end">
    <IconButton
      color="primary"
      component="label"
      sx={{
        padding: 0,
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
        width: '56px',
        height: '56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input hidden accept="image/*" type="file" onChange={(e) => handleImageChange(type, e)} />
      {image ? (
        <>
          <img
            src={image}
            alt={`${type} Image`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0)',
          }}>
            <EditIcon sx={{fontSize: 24 }} />
          </div>
        </>
      ) : (
        <>
          <UploadIcon sx={{ width: 20, height: 20 }} />
          <Typography variant="caption" align="center" sx={{ fontSize: '10px', position: 'absolute', bottom: 4, left: 0, right: 0 }}>
            Image
          </Typography>
        </>
      )}
    </IconButton>
  </Grid>
);

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
  //const [image, setImage] = useState(null);
  // eslint-disable-next-line 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [images, setImages] = useState({
    mainImage: null,
    trackerType: null,
    enclosureType: null,
    attachmentType: null,
  });  

  const [imageFiles, setImageFiles] = useState({
    mainImage: null,
    trackerType: null,
    enclosureType: null,
    attachmentType: null,
  })

  const handleImageChange = (field, e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]; // Get the actual file object

        // Store the image contents so that it can be uploaded
        setImages(prevImages => ({
            ...prevImages,
            [field]: file
        }));

        // Store the image filename so that it can be displayed
        setImageFiles(prevImages => ({
            ...prevImages,
            [field]: URL.createObjectURL(e.target.files[0])
        }))
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


  /*const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image);
    try {
      const response = await axios.post('/api/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.filename;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scientificName || !commonName || !recommendations) {
      setError("All fields are required.");
      return;
    }

    try {

      const imageUploads = Object.entries(images).map(async ([key, image]) => {
          if (image) {
              const filename = await uploadImage(image); // Pass the actual file object here
              return { [key]: filename };
          }
          return { [key]: null };
      });

      const uploadedImages = await Promise.all(imageUploads);
      const imageFilenames = Object.assign({}, ...uploadedImages);

      console.log(imageFilenames);

      const newPost = {
        postImage: imageFilenames.mainImage,
        title,
        scientificName,
        commonName,
        animalType,
        trackerType: trackerType === 'custom' ? customTrackerType : trackerType,
        trackerImage: imageFilenames.trackerType,
        dataTypes,
        enclosureType: enclosureType === 'custom' ? customEnclosureType : enclosureType,
        enclosureImage: imageFilenames.enclosureType,
        attachmentType: attachmentType === 'custom' ? customAttachmentType : attachmentType,
        attachmentImage: imageFilenames.attachmentType,
        recommendations
      };

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
        <Paper elevation={0} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom>
            New Animal Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Image Upload */}
              <Grid item xs={12}>
                <MainImageUploadArea type="mainImage" image={imageFiles.mainImage} handleImageChange={handleImageChange} />
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
                {/* Tracker Type and image */}
                <Grid container alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={10}>
                    <FormControl fullWidth>
                      <InputLabel>Tracker Type</InputLabel>
                      <Select
                        value={trackerType}
                        onChange={(e) => setTrackerType(e.target.value)}
                        label="Tracker Type"
                        required
                      >
                        <MenuItem value="VHF">VHF</MenuItem>
                        <MenuItem value="Satellite">Satellite</MenuItem>
                        <MenuItem value="LoRa">LoRa</MenuItem>
                        <MenuItem value="Acoustic">Acoustic</MenuItem>
                        <MenuItem value="Cellular / GSM">Cellular / GSM</MenuItem>
                        <MenuItem value="Bio-logger">Bio-logger</MenuItem>
                        <MenuItem value="RFID">RFID</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>



                      </Select>
                    </FormControl>
                  </Grid>
                  <ImageUploadArea type="trackerType" image={imageFiles.trackerType} handleImageChange={handleImageChange} />
                </Grid>
                {trackerType === 'custom' && (
                  <TextField
                    label="Custom Tracker Type"
                    variant="outlined"
                    value={customTrackerType}
                    onChange={(e) => setCustomTrackerType(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Enclosure Type and image */}
                <Grid container alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={10}>
                    <FormControl fullWidth>
                      <InputLabel>Enclosure Type</InputLabel>
                      <Select
                        value={enclosureType}
                        onChange={(e) => setEnclosureType(e.target.value)}
                        label="Enclosure Type"
                        required
                      >
                        <MenuItem value="Encapsulated">Encapsulated</MenuItem>
                        <MenuItem value="Potting">Potting</MenuItem>
                        <MenuItem value="Shrink wrap">Shrink wrap</MenuItem>
                        <MenuItem value="Hematic seal">Hematic seal</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <ImageUploadArea type="enclosureType" image={imageFiles.enclosureType} handleImageChange={handleImageChange} />
                </Grid>
                {enclosureType === 'custom' && (
                  <TextField
                    label="Custom Enclosure Type"
                    variant="outlined"
                    value={customEnclosureType}
                    onChange={(e) => setCustomEnclosureType(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Attachment Type and image */}
                <Grid container alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={10}>
                    <FormControl fullWidth>
                      <InputLabel>Attachment Type</InputLabel>
                      <Select
                        value={attachmentType}
                        onChange={(e) => setAttachmentType(e.target.value)}
                        label="Attachment Type"
                        required
                      >
                        <MenuItem value="Harness">Harness</MenuItem>
                        <MenuItem value="Collar">Collar</MenuItem>
                        <MenuItem value="Adhesive">Adhesive</MenuItem>
                        <MenuItem value="Implant">Implant</MenuItem>
                        <MenuItem value="Bolt">Bolt</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <ImageUploadArea type="attachmentType" image={imageFiles.attachmentType} handleImageChange={handleImageChange} />
                </Grid>
                {attachmentType === 'custom' && (
                  <TextField
                    label="Custom Attachment Type"
                    variant="outlined"
                    value={customAttachmentType}
                    onChange={(e) => setCustomAttachmentType(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
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