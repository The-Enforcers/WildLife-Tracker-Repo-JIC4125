import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { createPost, getPostById, updatePost, uploadImage } from "../../services/postService";
import {
  Box,
  Button,
  TextField,
  Typography,
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
import CloseIcon from '@mui/icons-material/Close';
//import Sidebar from "../../components/Sidebar/Sidebar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Edit as EditIcon } from '@mui/icons-material';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

//const mdParser = new MarkdownIt();

const dataTypeOptions = ["Accelerometry", "Body Temperature", "Environmental Temperature", "Heart Rate","Ambient Temperature","Pressure (air or water)"];

const MainImageUploadArea = ({ type, image, handleImageChange }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 200 }}>
      {image && (
        <img
          src={image instanceof File ? URL.createObjectURL(image) : image}
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
          bottom: 10,
          right: 10,
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
            src={image instanceof File ? URL.createObjectURL(image) : image}
            alt={`${type} Images`}
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
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
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
  const [error, setError] = useState("");
  const [errorOverlay, setErrorOverlay] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
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
  });
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://localhost:5001/api/user", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setShowPopup(true);
        }
      } catch (error) {
        setShowPopup(true);
      }
    };
    
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        setIsEditing(true);
        try {
          const postData = await getPostById(id);
          setTitle(postData.title);
          setScientificName(postData.scientificName);
          setCommonName(postData.commonName);
          setAnimalType(postData.animalType);
          setTrackerType(postData.trackerType);
          setDataTypes(postData.dataTypes);
	        setEnclosureType(postData.enclosureType);
          setAttachmentType(postData.attachmentType);
          setRecommendations(postData.recommendations);
          setImageFiles({
            mainImage: postData.postImage ? `https://${window.location.hostname}:5001/api/posts/image/${postData.postImage}` : null,
            trackerType: postData.trackerImage ? `https://${window.location.hostname}:5001/api/posts/image/${postData.trackerImage}` : null,
            enclosureType: postData.enclosureImage ? `https://${window.location.hostname}:5001/api/posts/image/${postData.enclosureImage}` : null,
            attachmentType: postData.attachmentImage ? `https://${window.location.hostname}:5001/api/posts/image/${postData.attachmentImage}` : null,
        });
        setImages({
          mainImage: null,
          trackerType: null,
          enclosureType: null,
          attachmentType: null,
        });
        } catch (error) {
          console.error("Error fetching post for editing:", error);
        }
      }
    };
    fetchPost();
  }, [id]);

  const handleClosePopup = () => {
    window.location.href = "https://localhost:5001/auth/google";
  };

  const handleImageChange = (field, e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setError(`Invalid file type. Allowed types are: ${ALLOWED_EXTENSIONS.join(', ')}`);
      setErrorOverlay(true);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      setErrorOverlay(true);
      return;
    }

    setImages(prevImages => ({
      ...prevImages,
      [field]: file
    }));

    setImageFiles(prevImages => ({
      ...prevImages,
      [field]: URL.createObjectURL(file)
    }));
  }
};

  const handleEditorChange = (text) => {
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
    const missingImages = [];
    if (!images.mainImage) missingImages.push("Main Image");
    if (!images.trackerType) missingImages.push("Tracker Type Image");
    if (!images.enclosureType) missingImages.push("Enclosure Type Image");
    if (!images.attachmentType) missingImages.push("Attachment Type Image");

    if (missingImages.length > 0) {
      const formattedMissingImages = missingImages.length > 1
        ? missingImages.slice(0, -1).join(", ") + " and " + missingImages[missingImages.length - 1]
        : missingImages[0];
      setError(`All image fields are required. You are missing: ${formattedMissingImages}`);
      return;
    }
    try {
      const imageUploads = Object.entries(images).map(async ([key, image]) => {
        if (image instanceof File) {
          const filename = await uploadImage(image);
          return { [key]: filename };
        }
        // If it's not a File object, it means we're using an existing image
        // So we extract the filename from the URL
        if (typeof imageFiles[key] === 'string') {
          return { [key]: imageFiles[key].split('/').pop() };
        }
        return { [key]: null };
      });
  
      const uploadedImages = await Promise.all(imageUploads);
      const imageFilenames = Object.assign({}, ...uploadedImages);
  
      const postData = {
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
        recommendations,
        author: user.displayName
      };
  
      if (isEditing) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }
      navigate("/results");
    } catch (error) {
      console.error("Error creating/updating post:", error);
      setError("An error occurred while saving the post. Please try again.");
    }
  };

  return (
    <>
      {errorOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '80%',
            textAlign: 'center',
          }}>
            <Typography variant="h6" style={{ marginBottom: '20px', color: 'red' }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setErrorOverlay(false)}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </div>
        </div>
      )}

{showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            You must be logged in to create a post.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClosePopup}>
            OK
          </Button>
        </div>
      )}

        <Paper elevation={0} sx={{ padding: 1, marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom>
            {isEditing ? "Edit Animal Profile" : "New Animal Profile"}
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MainImageUploadArea 
                  type="mainImage" 
                  image={imageFiles.mainImage} 
                  handleImageChange={handleImageChange} 
                />
              </Grid>
  
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
                  <ImageUploadArea 
                    type="trackerType" 
                    image={imageFiles.trackerType} 
                    handleImageChange={handleImageChange} 
                  />
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
                  <ImageUploadArea 
                    type="enclosureType" 
                    image={imageFiles.enclosureType} 
                    handleImageChange={handleImageChange} 
                  />
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
                  <ImageUploadArea 
                    type="attachmentType" 
                    image={imageFiles.attachmentType} 
                    handleImageChange={handleImageChange} 
                  />
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
  
              <Grid item xs={12} sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>Recommendations:</Typography>
                <ReactQuill
                  value={recommendations}
                  onChange={handleEditorChange}
                  theme="snow"
                  style={{ height: '300px' }}
                />
              </Grid>
  
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
                  {isEditing ? "Update" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
    </>
  );
};

export default CreatePostPage;