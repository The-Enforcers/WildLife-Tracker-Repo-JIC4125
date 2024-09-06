import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const ImageCard = ({ title, description, image }) => {
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
      <CardMedia
        component="img"
        height="110"
        image={image}
        alt={title}
        sx={{ borderRadius: 2 }} 
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
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
