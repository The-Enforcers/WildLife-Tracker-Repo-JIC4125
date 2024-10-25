import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    window.open("https://localhost:5001/auth/google", "_self"); 
  };
  const handleBack = () => {
    navigate('/');
  };
  return (
    <Container maxWidth="xs" sx={{ background: '#00000012' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '8rem',
          p: 3,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Sign in to your account
        </Typography>

        {/* Google Sign-In Button */}
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{ backgroundColor: '#000', color: '#fff', width: '100%', marginBottom: 1 }}
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>

        {/* Divider text */}
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Or continue later
        </Typography>

        {/* Sign In Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 0, mb: 1, backgroundColor: '#000', color: '#fff', width: '50%' }}
          onClick={handleBack}
        >
          back
        </Button>

        {/* Sign-up Link */}
        <Typography variant="body2" color="textSecondary">
          An account is needed to create posts.
        </Typography>

        <div className="main-bottom">
          <p className="bottom-info">Developed by Georgia Tech Students</p>
        </div>
      </Box>
    </Container>
  );
}

export default LoginPage;
