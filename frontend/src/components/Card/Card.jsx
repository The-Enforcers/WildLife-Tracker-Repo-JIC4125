import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ImageCard = ({ title, description, image, post_id, animalType, trackerType, icons }) => {
  return (
    <Card
      sx={{
        maxWidth: 340,
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

          {/* dynamically render icons passed as props */}
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', marginTop: 2, color: '#212e38d1' }}>
            {icons && icons.map((Icon, index) => (
              <Icon key={index} titleAccess={`Icon ${index}`} />
            ))}
          </Box>
        </CardContent>
      </a>
    </Card>
  );
};

export default ImageCard;
