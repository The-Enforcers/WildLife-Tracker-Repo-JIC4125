import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation

const ImageCard = ({
  title,
  image,
  post_id,
  author,
  authorImage,
  authorId,
  created,
  lastUpdated,
  scientificName,
  commonName,
  animalType,
  trackerType,
  enclosureType,
  likeCount,
  showDetails,
}) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleAuthorClick = (event) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the card
    navigate(`/user/${authorId}`); // Navigate to the author's profile page
  };

  const handleCardClick = () => {
    navigate(`/posts/${post_id}`); // Navigate to the post details page
  };

  return (
    <Card
      sx={{
        width: "100%",
        margin: "0px auto",
        borderRadius: 9,
        overflow: "hidden",
        cursor: "pointer",
        backgroundColor: "#efefef",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: 6,
        },
      }}
      onClick={handleCardClick} // Navigate to post details when card is clicked
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "240px",
          overflow: "hidden",
          
        }}
      >
        <img
          src={
            `https://${window.location.hostname}:5001/api/posts/image/` + image
          }
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: "10px",
            padding: "5px 10px",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            borderTopRightRadius: "50px",
          }}
        >
          <span role="img" aria-label="likes">
            ❤️
          </span>
          {likeCount}
          <Box></Box>
        </Box>
      </Box>
      <CardContent sx={{ padding: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={(theme) => ({
            fontWeight: "bold",
            color: "#333",
            whiteSpace: "normal",
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            lineHeight: "1.5em",
            height: "3em",
            marginBottom: "10px",
          
          })}
        >
          {title}
        </Typography>

        {showDetails && (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              className="card-text"
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <strong>Scientific name:</strong> {scientificName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="card-text"
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <strong>Common Names:</strong> {commonName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="card-text"
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <strong>Tracker Type:</strong> {trackerType}
            </Typography>
          </>
        )}

        <Box
          className="author-box-outer"
          sx={{
            backgroundColor: "#d5d5d5",
            borderRadius: "50px",
            marginTop: "15px",
            cursor: "pointer", // Add a pointer cursor to indicate it's clickable
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: 6,
            },
          }}
          onClick={handleAuthorClick} // Navigate to profile when author box is clicked
        >
          <Box
            className="author-box"
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "5px",
              margin: "auto",
            }}
          >
            <img
              className="authorImage"
              src={authorImage || "https://via.placeholder.com/150"}
              alt="Author"
              style={{ width: "50px", borderRadius: "50px" }}
            />
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px",
                height: "50px",
              }}
            >
              <span style={{ paddingTop: "3px" }}>
                <strong>{author}</strong>
              </span>
              
            </Typography>
            
          </Box>
        </Box>
     
      </CardContent>
    </Card>
  );
};

export default ImageCard;
