import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ImageCard = ({ title, description, image, post_id }) => {
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
      <a href={`/post/${post_id}`} style={{ textDecoration: 'none' }}>
        {/* Ensure the src attribute is properly set here */}
        <img src={"https://localhost:5001/api/posts/image/" + image} alt={title}
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
            {description}
          </Typography>
        </CardContent>
      </a>
    </Card>
  );
};

export default ImageCard;
