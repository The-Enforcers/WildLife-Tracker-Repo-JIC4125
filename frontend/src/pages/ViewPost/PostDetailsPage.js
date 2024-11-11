import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  bookmarkPost,
  unbookmarkPost,
} from "../../services/postService";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
// CSS file
import "./PostDetailsPage.css";
//MUI components
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Button,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { useSnackbar } from "../../components/SnackBar/SnackBar";

const PostDetailsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext);
  const showSnackbar = useSnackbar();

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleBoxClick = (boxType) => {
    setExpandedBox((prev) => (prev === boxType ? null : boxType));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
        setLikeCount(data.likeCount || 0);

        if (user && user.bookmarkedPosts) {
          setIsBookmarked(user.bookmarkedPosts.includes(id));
        }
      } catch (error) {
        setError("Failed to fetch post data.");
        console.error("Failed to fetch post", error);
      }
    };
    fetchPost();
  }, [id, user]);

  useEffect(() => {
    const checkLikeStatus = async () => {
        if (user && post) {
            try {
                const response = await fetch(`https://${window.location.hostname}:5001/api/posts/${id}/hasLiked`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setIsLiked(data.hasLiked);
            } catch (error) {
                console.error("Failed to check like status", error);
            }
        }
    };
    checkLikeStatus();
  }, [user, post, id, token]);

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await unbookmarkPost(user._id, id);
        showSnackbar("Bookmark Removed", "error");
      } else {
        await bookmarkPost(user._id, id);
        showSnackbar("Bookmark Added", "success");
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      showSnackbar("Please log in to like posts", "error");
      return;
    }
  
    try {
      const response = await fetch(`https://${window.location.hostname}:5001/api/posts/${id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Changed from user.token
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(data.likeCount);
        showSnackbar(isLiked ? "Post unliked" : "Post liked", isLiked ? "error" : "success");
      } else {
        showSnackbar("Failed to update like status", "error");
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
      showSnackbar("Failed to update like status", "error");
    }
  };

  if (error) return <div style={styles.error}>{error}</div>;
  if (!post) return <div style={styles.loading}>Loading...</div>;

  return (
    <>
      <div className="post-container">
        <div className="post-container-inner">
          <div className="button-container">
            {user && post && user.displayName === post.author && (
              <Tooltip
                title="Edit Animal Profile"
                placement="top"
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -8],
                      },
                    },
                  ],
                }}
              >
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
                  <span style={{paddingTop: "2px"}}>Edit</span>
                </Button>
              </Tooltip>
            )}

            {user && (
              <>
                <IconButton
                  onClick={handleBookmark}
                  aria-label="bookmark post"
                  sx={{
                    backgroundColor: "#212e38",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#303f9f",
                    },
                    borderRadius: "50%",
                    padding: "10px",
                    marginLeft: "8px",
                  }}
                >
                  <Tooltip
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    placement="top"
                  >
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </Tooltip>
                </IconButton>

                <IconButton
                  onClick={handleLike}
                  aria-label="like post"
                  sx={{
                    backgroundColor: "#212e38",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#303f9f",
                    },
                    borderRadius: "50%",
                    padding: "10px",
                    marginLeft: "8px",
                  }}
                >
                  <Tooltip
                    title={isLiked ? "Unlike" : "Like"}
                    placement="top"
                  >
                    {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </Tooltip>
                </IconButton>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    marginLeft: "8px", 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#666'
                  }}
                >
                  {likeCount}
                </Typography>
              </>
            )}
          </div>

          <div className="post-head">
            <div className="post-meta">
              <p className="post-title"> {post.title} </p>
              <div className="animal-names">
                <div className="name-box">
                  <p className="name-header">Scientific Name</p>
                  <p className="scientific-name">{post.scientificName}</p>
                </div>
                {post.commonName && 
                <div className="name-box">
                  <p className="name-header">Common Names</p>
                  <p className="common-name">{post.commonName}</p>
                </div>}
                {post.animalType && 
                <div className="name-box">
                  <p className="name-header">Animal Type</p>
                  <p className="common-name">{post.animalType}</p>
                </div>}
              </div>
              <div className="post-author">
                  <img
                    className="profile-picture"
                    src={post.authorImage || "https://via.placeholder.com/150"} // Placeholder if author image is null
                    alt="Author"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150"; // Fallback image if the primary fails to load
                    }}
                  />

                  <p className="author-name"> {post.author}</p>
                </div>
                {post.lastUpdated && (
                  <Typography variant="body2" color="textSecondary">
                    Last updated:{" "}
                    {new Date(post.lastUpdated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(post.lastUpdated).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                )}
            </div>
            
            <div className="post-picture">
              <img
                className="post-image"
                src={`https://${window.location.hostname}:5001/api/posts/image/${post.postImage}`}
                alt="Animal Profile"
              />
            </div>
          </div>

          <div className="data-types">
            {post.dataTypes.map((dataType, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f0f4f9',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  margin: '5px',
                  fontSize: '14px',
                  color: '#333',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  textTransform: 'capitalize',
                }}
              >
                {dataType}
              </span>
            ))}
          </div>

          <div className="tracker-info">
            <div className="tracker-info-head">
              <div
                className={`tracker-info-box-${expandedBox === "tracker" ? "selected" : ""}`}
                onClick={() => post.trackerImage && handleBoxClick("tracker")}
                style={{ cursor: post.trackerImage ? "pointer" : "default" }}
              >
                <p className="tracker-info-actual">{post.trackerType}</p>
                <p className="tracker-info-header">Tracker</p>
                <div className={`expand-icon ${!post.trackerImage ? "no-image" : ""}`}>
                  {expandedBox === "tracker" ? <p>hide</p> : <p>show</p>}
                  {expandedBox === "tracker" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
              </div>

              <div
                className={`tracker-info-box-${expandedBox === "enclosure" ? "selected" : ""}`}
                onClick={() => post.enclosureImage && handleBoxClick("enclosure")}
                style={{ cursor: post.enclosureImage ? "pointer" : "default" }}
              >
                <p className="tracker-info-actual">{post.enclosureType}</p>
                <p className="tracker-info-header">Enclosure</p>
                <div className={`expand-icon ${!post.enclosureImage ? "no-image" : ""}`}>
                  {expandedBox === "enclosure" ? <p>hide</p> : <p>show</p>}
                  {expandedBox === "enclosure" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
              </div>

              <div
                className={`tracker-info-box-${expandedBox === "attachment" ? "selected" : ""}`}
                onClick={() => post.attachmentImage && handleBoxClick("attachment")}
                style={{ cursor: post.attachmentImage ? "pointer" : "default" }}
              >
                <p className="tracker-info-actual">{post.attachmentType}</p>
                <p className="tracker-info-header">Attachment</p>
                <div className={`expand-icon ${!post.attachmentImage ? "no-image" : ""}`}>
                  {expandedBox === "attachment" ? <p>hide</p> : <p>show</p>}
                  {expandedBox === "attachment" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
              </div>
            </div>

            <div className={`expanded-images-container ${expandedBox ? "expanded" : ""}`}>
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

          <div style={{width: "80%", margin: "0px auto", paddingBottom: "200px"}}>
            <ReactQuill
              value={post.recommendations || ""}
              readOnly={true}
              theme="bubble"
            />
          </div>
        </div>
      </div>
    </>
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
    display: "block",
    margin: "10px auto",
    maxHeight: "25vh",
    width: "auto",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default PostDetailsPage;
