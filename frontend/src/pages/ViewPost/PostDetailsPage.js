import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById } from "../../services/postService";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import "./PostDetailsPage.css";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { Breadcrumbs, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);
  const navigate = useNavigate();

  const handleBoxClick = (boxType) => {
    setExpandedBox((prev) => (prev === boxType ? null : boxType));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);

        if (data.trackerImage) {
          setExpandedBox("tracker");
        } else if (data.enclosureImage) {
          setExpandedBox("enclosure");
        } else if (data.attachmentImage) {
          setExpandedBox("attachment");
        }
      } catch (error) {
        setError("Failed to fetch post data.");
        console.error("Failed to fetch post", error);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://${window.location.hostname}:5001/api/user`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  if (error) return <div style={styles.error}>{error}</div>;
  if (!post) return <div style={styles.loading}>Loading...</div>;

  const shortenedTitle = post.title.split(" ").slice(0, 3).join(" ");

  return (
    <div className="main">
      {/* Breadcrumbs section */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ marginLeft: 4, marginBlock: 1 }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Home
        </Link>
        <Link to="/results" style={{ textDecoration: "none", color: "inherit" }}>
          Search Results
        </Link>
        <Typography color="text.primary">
          {shortenedTitle} {post.title.split(" ").length > 3 ? "..." : ""}
        </Typography>
      </Breadcrumbs>
      <div className="main-container">
        <div className="button-container">
          {user && post && user.displayName === post.author && (
            <Button
              variant="contained"
              onClick={handleEdit}
              startIcon={<EditIcon />}
              sx={{
                backgroundColor: "#212e38",
                color: "white",
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
                textTransform: "none",
                fontSize: "15px",
                fontWeight: "bold",
                borderRadius: "20px",
                padding: "8px 16px",
              }}
            >
              Edit Post
            </Button>
          )}
        </div>
        <div className="post-head">
          <div className="post-meta">
            <p className="post-title"> {post.title} </p>
            <div className="post-author">
              <img
                className="profile-picture"
                src="https://zsuttonphoto.com/wp-content/uploads/2016/05/Los-Angeles-Headshot-Photography-8.jpg"
                alt="Author"
              />
              <p className="author-name"> {post.author}</p>
            </div>
            <div className="animal-names">
              <div className="name-box">
                <p className="name-header">Scientific Name</p>
                <p className="scientific-name">{post.scientificName}</p>
              </div>
              <div className="name-box">
                <p className="name-header">Common Name</p>
                <p className="common-name">{post.commonName}</p>
              </div>
            </div>
          </div>
          <div className="post-picture">
            <img
              className="post-image"
              src={`https://${window.location.hostname}:5001/api/posts/image/${post.postImage}`}
              alt="Post"
            />
          </div>
        </div>
        <div className="tracker-info">
          <div className="tracker-info-head">
            <div
              className={`tracker-info-box-${
                expandedBox === "tracker" ? "selected" : ""
              }`}
              onClick={() => post.trackerImage && handleBoxClick("tracker")}
              style={{ cursor: post.trackerImage ? "pointer" : "default" }}
            >
              <p className="tracker-info-actual">{post.trackerType}</p>
              <p className="tracker-info-header">Tracker</p>
              <div
                className={`expand-icon ${
                  !post.trackerImage ? "no-image" : ""
                }`}
              >
                {expandedBox === "tracker" ? <p>hide</p> : <p>show</p>}
                {expandedBox === "tracker" ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </div>
            </div>

            <div
              className={`tracker-info-box-${
                expandedBox === "enclosure" ? "selected" : ""
              }`}
              onClick={() => post.enclosureImage && handleBoxClick("enclosure")}
              style={{ cursor: post.enclosureImage ? "pointer" : "default" }}
            >
              <p className="tracker-info-actual">{post.enclosureType}</p>
              <p className="tracker-info-header">Enclosure</p>
              <div
                className={`expand-icon ${
                  !post.enclosureImage ? "no-image" : ""
                }`}
              >
                {expandedBox === "enclosure" ? <p>hide</p> : <p>show</p>}
                {expandedBox === "enclosure" ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </div>
            </div>

            <div
              className={`tracker-info-box-${
                expandedBox === "attachment" ? "selected" : ""
              }`}
              onClick={() =>
                post.attachmentImage && handleBoxClick("attachment")
              }
              style={{ cursor: post.attachmentImage ? "pointer" : "default" }}
            >
              <p className="tracker-info-actual">{post.attachmentType}</p>
              <p className="tracker-info-header">Attachment</p>
              <div
                className={`expand-icon ${
                  !post.attachmentImage ? "no-image" : ""
                }`}
              >
                {expandedBox === "attachment" ? <p>hide</p> : <p>show</p>}
                {expandedBox === "attachment" ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </div>
            </div>
          </div>

          <div
            className={`expanded-images-container ${
              expandedBox ? "expanded" : ""
            }`}
          >
            {expandedBox === "tracker" && post.trackerImage && (
              <img
                src={`https://${window.location.hostname}:5001/api/posts/image/${post.trackerImage}`}
                alt="Tracker"
                style={styles.expandedImage}
              />
            )}
            {expandedBox === "enclosure" && post.enclosureImage && (
              <img
                src={`https://${window.location.hostname}:5001/api/posts/image/${post.enclosureImage}`}
                alt="Enclosure"
                style={styles.expandedImage}
              />
            )}
            {expandedBox === "attachment" && post.attachmentImage && (
              <img
                src={`https://${window.location.hostname}:5001/api/posts/image/${post.attachmentImage}`}
                alt="Attachment"
                style={styles.expandedImage}
              />
            )}
          </div>
        </div>

        <ReactQuill
          value={post.recommendations || ""}
          readOnly={true}
          theme="bubble"
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    minHeight: "80vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  detailsContainer: {
    marginBottom: "20px",
  },
  button: {
    display: "block",
    width: "200px",
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  loading: {
    fontSize: "18px",
    textAlign: "center",
    marginTop: "50px",
    color: "#666",
  },
  error: {
    fontSize: "18px",
    textAlign: "center",
    marginTop: "50px",
    color: "red",
  },
  expandedImage: {
    display: "block", // Ensure the image is a block element
    margin: "10px auto", // Center the image
    width: "80%", // Optional: Control the image size
    maxWidth: "600px", // Optional: Max width for the image
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default PostDetailsPage;
