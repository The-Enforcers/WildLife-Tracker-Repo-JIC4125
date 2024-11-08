import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ImageCard = ({ title, image, post_id, animalType, trackerType, enclosureType }) => {
  return (
    <Card
      sx={{
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
            sx={{ fontWeight: 'bold', color: '#333' }}
          >
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Animal Type:</strong> {animalType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Tracker Type:</strong> {trackerType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Enclosure Type:</strong> {enclosureType}
          </Typography>

        </CardContent>
      </a>
    </Card>
  );
};

export default ImageCard;
