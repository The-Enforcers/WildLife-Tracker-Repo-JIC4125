import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ImageCard = ({ title, image, post_id, author, authorImage, authorId, scientificName, commonNames, animalType, trackerType, enclosureType }) => {
  return (
    <Card
      sx={{
        width: '100%', // Ensure card takes up all available space in its grid item
        maxWidth: 340, // You can increase this if you want to give the card a larger maximum width
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
        <img src={`https://${window.location.hostname}:5001/api/posts/image/` + image} alt={title}
          style={{
            width: '100%',
            height: '110px',
            objectFit: 'cover',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        />
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
              minHeight: "calc(1.5em * 2)"
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="card-text"
            sx={{whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
            <strong>Scientific name:</strong> {scientificName}
          </Typography><Typography variant="body2" color="text.secondary" className="card-text"
            sx={{whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
            <strong>Common Names:</strong> {commonNames}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="card-text"
            sx={{whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
            <strong>Animal Family:</strong> {animalType}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="card-text"
            sx={{whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
            <strong>Tracker Type:</strong> {trackerType}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="card-text"
            sx={{whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
            <strong>Enclosure Type:</strong> {enclosureType}
          </Typography>

          <Box className="author-box-outer" 
            sx={{
              backgroundColor: "#f0f4f9", 
              borderRadius: "50px", 
              marginTop: "15px",
              // Will add this transition back in when we add profile pages
              /*transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 1,
              },*/
            }}>
            <Box className="author-box" sx={{display: "flex", flexDirection: "row", padding: "10px", margin: "auto"}}>
              <img
                className="authorImage" 
                src={authorImage || "https://via.placeholder.com/150"} // Placeholder if author image is null
                alt="Author"
                style={{width: "50px", borderRadius: "50px"}}
              />
              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  display: "flex",
                  alignItems: "center", // Centers content vertically
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
