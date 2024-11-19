import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ImageCard = ({ title, image, post_id, author, authorImage, authorId, created, lastUpdated, scientificName, commonName, animalType, trackerType, enclosureType, likeCount }) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 340,
        margin: "0px auto",
        borderRadius: 9,
        overflow: 'hidden',
        boxShadow: 3,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}
    >
      <a href={`/posts/${post_id}`} style={{ textDecoration: 'none' }}>
        <Box sx={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
          <img
            src={`https://${window.location.hostname}:5001/api/posts/image/` + image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderTopRightRadius: "50px"
            }}
          >
            <span role="img" aria-label="likes">❤️</span>
            {likeCount}
            <Box sx={{width: "0px"}}>
              
            </Box>
          </Box>

        </Box>
        <CardContent sx={{ padding: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              whiteSpace: "normal",
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "2",
              lineHeight: "1.5em",
              maxHeight: "calc(1.5em * 2)",
              minHeight: "calc(1.5em * 2)",
              marginBottom: "10px"
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{marginBottom: "10px"}}>
            <strong>Last Updated: </strong>
            {lastUpdated ? (new Date(created).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })) : (new Date(created).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }))}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="card-text"
            sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
            <strong>Scientific name:</strong> {scientificName}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="card-text"
            sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
            <strong>Common Names:</strong> {commonName}
          </Typography>

          <Box className="author-box-outer"
            sx={{
              backgroundColor: "#f0f4f9",
              borderRadius: "50px",
              marginTop: "15px",
            }}>
            <Box className="author-box" sx={{ display: "flex", flexDirection: "row", padding: "10px", margin: "auto" }}>
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
      </a>
    </Card>
  );
};

export default ImageCard;
