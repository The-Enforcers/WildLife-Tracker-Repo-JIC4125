// CreatePostPage.js
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// React Quill for rich text editor
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { quillModules, quillFormats } from './QuillConfig';

// MUI Icons
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';

import {
  createPost,
  getPostById,
  updatePost,
  uploadImage,
  deleteImage,
  deletePost,
} from "../../services/postService";
import { useSnackbar } from "../../components/SnackBar/SnackBar";

import "./CreatePostPage.css";

// Constants for image uploads
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];

// Options for data types
const dataTypeOptions = [
  "Accelerometry",
  "Body Temperature",
  "Environmental Temperature",
  "Heart Rate",
  "Ambient Temperature",
  "Pressure (air or water)",
];

// Component for the top image upload area
const TopImageUploadArea = ({ images, handleImageChange, handleImageDelete }) => {
  const imageTypes = [
    { type: 'mainImage', label: 'Main Image', required: true },
    { type: 'trackerType', label: 'Tracker Image', required: false },
    { type: 'enclosureType', label: 'Enclosure Image', required: false },
    { type: 'attachmentType', label: 'Attachment Image', required: false },
  ];

  // Filter out images that haven't been uploaded yet (except for Main Image)
  const displayedImages = imageTypes.filter(imgType => {
    if (imgType.type === 'mainImage') {
      return true;
    }
    return images[imgType.type];
  });

  return (
    <Grid container spacing={2} justifyContent="center" className="top-image-upload-area">
      {displayedImages.map((imgType, index) => (
        <Grid item xs={12} sm={3} key={index}>
          <Box
            className={`image-upload-box ${
              images[imgType.type] ? 'uploaded' : 'not-uploaded'
            } ${imgType.required ? 'required' : 'optional'}`}
          >
            {!imgType.required && images[imgType.type] && (
              <IconButton
                className="delete-image-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleImageDelete(imgType.type);
                }}
                size="small"
              >
                <CloseIcon className="delete-icon" />
              </IconButton>
            )}
            <input
              key={images[imgType.type] ? images[imgType.type].name || images[imgType.type] : ''}
              hidden
              accept="image/*"
              type="file"
              id={`upload-${imgType.type}`}
              onChange={(e) => handleImageChange(imgType.type, e)}
            />
            <label htmlFor={`upload-${imgType.type}`}>
              <Box className="upload-box-content">
                {images[imgType.type] ? (
                  <>
                    <img
                      src={
                        images[imgType.type] instanceof File
                          ? URL.createObjectURL(images[imgType.type])
                          : images[imgType.type]
                      }
                      alt={imgType.label}
                      className="uploaded-image"
                    />
                    <Box className="overlay-circle">
                      <UploadIcon className="overlay-icon" />
                    </Box>
                  </>
                ) : (
                  <UploadIcon className="upload-icon" />
                )}
                <Typography
                  variant="subtitle1"
                  className="upload-label"
                >
                  {imgType.label}{' '}
                  {imgType.required && (
                    <span className="required-indicator">*</span>
                  )}
                </Typography>
              </Box>
            </label>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

// Component for image upload button (used for tracker, enclosure, attachment)
const ImageUploadButton = ({ type, image, handleImageChange, label }) => (
  <Grid item xs={3} container alignItems="center" justifyContent="flex-end" className="image-upload-button-container">
    <Button
      variant="outlined"
      component="label"
      className={`image-upload-button ${image ? 'uploaded' : 'not-uploaded'}`} // Apply 'uploaded' class conditionally
      startIcon={<UploadIcon />}
    >
      {label}
      <input
        hidden
        accept="image/*"
        type="file"
        onChange={(e) => handleImageChange(type, e)}
      />
    </Button>
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
  const { user, loading } = useContext(UserContext);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [editorHeight, setEditorHeight] = useState(600);
  const [isResizing, setIsResizing] = useState(false);

  const editorContainerRef = useRef(null);
  const pageContainerRef = useRef(null);
  const quillRef = useRef(null);
  const submitButtonRef = useRef(null);

  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const sensitivity = 1; // Adjust this value as needed

  const [images, setImages] = useState({
    mainImage: null,
    trackerType: null,
    enclosureType: null,
    attachmentType: null,
  });

  // State for delete confirmation dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Handle deletion of the post
  const handleDeleteClick = () => {
    console.log("Delete button clicked. Opening confirmation dialog.");
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    console.log("Confirm delete clicked. Initiating delete process.");
    try {
      console.log("Deleting post with ID:", id);
      await deletePost(id);
      showSnackbar("Post deleted successfully", "success");
      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      showSnackbar(error.message || "Error deleting post", "error");
    } finally {
      console.log("Closing confirmation dialog.");
      setOpenConfirmDialog(false);
    }
  };

  const handleCancelDelete = () => {
    console.log("Cancel delete clicked. Closing confirmation dialog.");
    setOpenConfirmDialog(false);
  };

  const handleResizeStart = useCallback(
    (e) => {
      e.preventDefault();
      setIsResizing(true);
      setStartY(e.clientY);
      setStartHeight(editorHeight);
    },
    [editorHeight]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (isResizing) {
        const deltaY = e.clientY - startY;
        const adjustedDeltaY = deltaY * sensitivity;
        const newHeight = Math.max(200, startHeight + adjustedDeltaY);

        setEditorHeight(newHeight);

        // Scroll logic adjusted to keep the entire submit button in view
        const submitButton = submitButtonRef.current;
        const pageContainer = pageContainerRef.current;
        if (submitButton && pageContainer) {
          const padding = 20; // Adjust as needed

          // Calculate the bottom position of the submit button relative to the page container
          const submitButtonOffsetTop =
            submitButton.offsetTop + submitButton.offsetHeight + padding;

          // The current visible area bottom
          const visibleAreaBottom = pageContainer.scrollTop + pageContainer.clientHeight;

          // If the submit button's bottom is below the visible area, scroll down
          if (submitButtonOffsetTop > visibleAreaBottom) {
            const scrollAmount = submitButtonOffsetTop - visibleAreaBottom;
            pageContainer.scrollTop += scrollAmount;
          }
        }
      }
    },
    [isResizing, startY, startHeight, sensitivity]
  );

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  useEffect(() => {
    if (!loading && !user) {
      setShowPopup(true);
    }
  }, [loading, user]);

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

          // Build the image URLs
          const mainImageUrl = postData.postImage
            ? `https://${window.location.hostname}:5001/api/posts/image/${postData.postImage}`
            : null;
          const trackerImageUrl = postData.trackerImage
            ? `https://${window.location.hostname}:5001/api/posts/image/${postData.trackerImage}`
            : null;
          const enclosureImageUrl = postData.enclosureImage
            ? `https://${window.location.hostname}:5001/api/posts/image/${postData.enclosureImage}`
            : null;
          const attachmentImageUrl = postData.attachmentImage
            ? `https://${window.location.hostname}:5001/api/posts/image/${postData.attachmentImage}`
            : null;

          // Set images state with URLs
          setImages({
            mainImage: mainImageUrl,
            trackerType: trackerImageUrl,
            enclosureType: enclosureImageUrl,
            attachmentType: attachmentImageUrl,
          });

          setLastUpdatedDate(postData.lastUpdated);
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
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        setError(`Invalid file type. Allowed types are: ${ALLOWED_EXTENSIONS.join(", ")}`);
        setErrorOverlay(true);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
        setErrorOverlay(true);
        return;
      }

      setImages((prevImages) => ({
        ...prevImages,
        [field]: file,
      }));

      // Reset the input value to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const handleImageDelete = async (imageType) => {
    try {
      console.log('Delete initiated for:', imageType);

      if (isEditing) {
        const fieldMapping = {
          trackerType: 'trackerImage',
          enclosureType: 'enclosureImage',
          attachmentType: 'attachmentImage'
        };

        const imageField = fieldMapping[imageType];
        if (!imageField) {
          throw new Error('Invalid image type for deletion');
        }

        // Update state immediately for UI feedback
        setImages(prevImages => ({
          ...prevImages,
          [imageType]: null
        }));

        // Call backend
        const updatedPost = await deleteImage(id, imageField);
        showSnackbar("Image deleted successfully", "success");

        // Update all image states based on the returned post data
        setImages({
          mainImage: updatedPost.postImage ?
            `https://${window.location.hostname}:5001/api/posts/image/${updatedPost.postImage}` : null,
          trackerType: updatedPost.trackerImage ?
            `https://${window.location.hostname}:5001/api/posts/image/${updatedPost.trackerImage}` : null,
          enclosureType: updatedPost.enclosureImage ?
            `https://${window.location.hostname}:5001/api/posts/image/${updatedPost.enclosureImage}` : null,
          attachmentType: updatedPost.attachmentImage ?
            `https://${window.location.hostname}:5001/api/posts/image/${updatedPost.attachmentImage}` : null
        });
      } else {
        // For new posts, just update state
        setImages(prevImages => ({
          ...prevImages,
          [imageType]: null
        }));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      showSnackbar(error.message || "Failed to delete image", "error");
    }
  };

  const handleEditorChange = (text) => {
    setRecommendations(text);
  };

  const handleDataTypeToggle = (dataType) => {
    setDataTypes((prev) =>
      prev.includes(dataType)
        ? prev.filter((type) => type !== dataType)
        : [...prev, dataType]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scientificName || !commonName || !recommendations) {
      setError("All fields are required.");
      return;
    }

    if (!images.mainImage) {
      setError(`Main image required`);
      return;
    }

    try {
      const imageUploads = Object.entries(images).map(async ([key, image]) => {
        if (image instanceof File) {
          const filename = await uploadImage(image);
          return { [key]: filename };
        }
        if (typeof image === "string") {
          // Extract the filename from the URL
          const parts = image.split("/");
          const filename = parts[parts.length - 1];
          return { [key]: filename };
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
        trackerType: trackerType === "custom" ? customTrackerType : trackerType,
        trackerImage: imageFilenames.trackerType,
        dataTypes,
        enclosureType: enclosureType === "custom" ? customEnclosureType : enclosureType,
        enclosureImage: imageFilenames.enclosureType,
        attachmentType: attachmentType === "custom" ? customAttachmentType : attachmentType,
        attachmentImage: imageFilenames.attachmentType,
        recommendations,
        author: user.displayName,
        // authorId: user.googleId, // Removed as backend handles it
        authorImage: user.picture,
        lastUpdated: new Date().toISOString(),
      };

      if (isEditing) {
        await updatePost(id, postData);
        showSnackbar("Updated!", "success");
        setLastUpdatedDate(new Date().toLocaleString());
        navigate("/posts/" + id);
      } else {
        const saved_post = await createPost(postData);
        showSnackbar("Posted!", "success");
        navigate("/posts/" + saved_post._id);
      }
    } catch (error) {
      showSnackbar("Error creating/updating post", "error");
      console.error("Error creating/updating post:", error);
      setError("An error occurred while saving the post. Please try again.");
    }
  };

  return (
    <Box className="page-container" ref={pageContainerRef}>
      {errorOverlay && (
        <div className="error-overlay">
          <div className="error-popup">
            <Typography variant="h6" className="error-message">
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
        <>
          <div className="popup-overlay" />
          <div className="login-popup">
            <Typography variant="h6" gutterBottom>
              You must be logged in to create a post.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClosePopup}
            >
              OK
            </Button>
          </div>
        </>
      )}

      <Paper elevation={0} className="paper-form">
        {isEditing && (
          <Button
          sx={{borderRadius: "25px", color: "white", fontWeight: "bold"}}
          variant="contained"
          color="error" // This will style the button in red
          className="delete-post-button"
          onClick={handleDeleteClick}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        )}

        <Typography variant="h4" gutterBottom className="form-title">
          {isEditing ? "Edit Animal Profile" : "New Animal Profile"}
        </Typography>

        {lastUpdatedDate && (
          <Typography variant="body2" color="textSecondary" align="center">
            Edited:{" "}
            {new Date(lastUpdatedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at{" "}
            {new Date(lastUpdatedDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        )}

        {error && (
          <Typography color="error" className="error-text">
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} className="form-container">
          <TopImageUploadArea
            images={images}
            handleImageChange={handleImageChange}
            handleImageDelete={handleImageDelete}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} className="left-column">
              <TextField
                id="post-title"
                name="post-title"
                label="Post Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                className="text-field"
              />
              <TextField
                id="scientific-name"
                name="scientific-name"
                label="Scientific Name"
                variant="outlined"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                required
                fullWidth
                className="text-field"
              />
              <TextField
                id="common-name"
                name="common-name"
                label="Common Name(s)"
                variant="outlined"
                value={commonName}
                onChange={(e) => setCommonName(e.target.value)}
                required
                fullWidth
                className="text-field"
              />
              <FormControl fullWidth className="form-control">
                <InputLabel id="animal-type-label">Animal Family</InputLabel>
                <Select
                  id="animal-type"
                  name="animal-type"
                  labelId="animal-type-label"
                  value={animalType}
                  onChange={(e) => setAnimalType(e.target.value)}
                  label="Animal Family"
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
              {/* Tracker Type Section */}
              <Grid container spacing={1} className="input-group" alignItems="center">
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <InputLabel id="tracker-type-label">Tracker Type</InputLabel>
                    <Select
                      id="tracker-type"
                      name="tracker-type"
                      labelId="tracker-type-label"
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
                  {trackerType === "custom" && (
                    <TextField
                      id="custom-tracker-type"
                      name="custom-tracker-type"
                      label="Custom Tracker Type"
                      variant="outlined"
                      value={customTrackerType}
                      onChange={(e) => setCustomTrackerType(e.target.value)}
                      required
                      fullWidth
                      className="text-field custom-text-field"
                    />
                  )}
                </Grid>
                <ImageUploadButton
                  type="trackerType"
                  image={images.trackerType}
                  handleImageChange={handleImageChange}
                  label="Image"
                />
              </Grid>

              {/* Enclosure Type Section */}
              <Grid container spacing={1} className="input-group" alignItems="center">
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <InputLabel id="enclosure-type-label">Enclosure Type</InputLabel>
                    <Select
                      id="enclosure-type"
                      name="enclosure-type"
                      labelId="enclosure-type-label"
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
                  {enclosureType === "custom" && (
                    <TextField
                      id="custom-enclosure-type"
                      name="custom-enclosure-type"
                      label="Custom Enclosure Type"
                      variant="outlined"
                      value={customEnclosureType}
                      onChange={(e) => setCustomEnclosureType(e.target.value)}
                      required
                      fullWidth
                      className="text-field custom-text-field"
                    />
                  )}
                </Grid>
                <ImageUploadButton
                  type="enclosureType"
                  image={images.enclosureType}
                  handleImageChange={handleImageChange}
                  label="Image"
                />
              </Grid>

              {/* Attachment Type Section */}
              <Grid container spacing={1} className="input-group" alignItems="center">
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <InputLabel id="attachment-type-label">Attachment Type</InputLabel>
                    <Select
                      id="attachment-type"
                      name="attachment-type"
                      labelId="attachment-type-label"
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
                  {attachmentType === "custom" && (
                    <TextField
                      id="custom-attachment-type"
                      name="custom-attachment-type"
                      label="Custom Attachment Type"
                      variant="outlined"
                      value={customAttachmentType}
                      onChange={(e) => setCustomAttachmentType(e.target.value)}
                      required
                      fullWidth
                      className="text-field custom-text-field"
                    />
                  )}
                </Grid>
                <ImageUploadButton
                  type="attachmentType"
                  image={images.attachmentType}
                  handleImageChange={handleImageChange}
                  label="Image"
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Data Types:
              </Typography>
              <Box className="data-types-container">
                {dataTypeOptions.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    onClick={() => handleDataTypeToggle(option)}
                    color={dataTypes.includes(option) ? "primary" : "default"}
                    className="data-type-chip"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} className="recommendations-section">
              <Typography variant="h6" gutterBottom>
                Recommendations:
              </Typography>
              <div
                className="resizable-editor"
                style={{ height: editorHeight }}
                ref={editorContainerRef}
              >
                {isResizing && <div className="editor-overlay" />}
                <ReactQuill
                  ref={quillRef}
                  value={recommendations}
                  onChange={handleEditorChange}
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  style={{ height: editorHeight - 42 }}
                />
                <div
                  className="resize-handle"
                  onMouseDown={handleResizeStart}
                  title="Drag to resize"
                />
              </div>
            </Grid>

            <Grid item xs={12}  ref={submitButtonRef}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{borderRadius: "25px", color: "white", fontWeight: "bold", background: "#212e38"}}
              >
                {isEditing ? "Update" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary" type="button">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" type="button" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePostPage;
