import React, { useEffect, useContext } from 'react';  // Added useContext here
import { Button, Typography, Container, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.js';

function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useContext(UserContext); // Access setToken from UserContext

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Update token in the React state (via context)
      setToken(token);  // This will trigger re-render and update other components

      // Clear URL params after setting the token (optional)
      window.history.replaceState({}, '', window.location.pathname);

      // Optionally, wait for a bit before redirecting

        navigate('/');  // Navigate to the main page

    }
  }, [navigate, setToken]);

  const handleGoogleSignIn = () => {
    window.open("https://localhost:5001/auth/google", "_self"); 
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="xs" sx={{ background: '#00000012' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '8rem',
        p: 3,
      }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sign in to your account
        </Typography>

        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{ backgroundColor: '#000', color: '#fff', width: '100%', marginBottom: 1 }}
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>

        <Typography variant="body1" color="textSecondary" gutterBottom>
          Or continue later
        </Typography>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 0, mb: 1, backgroundColor: '#000', color: '#fff', width: '50%' }}
          onClick={handleBack}
        >
          Back
        </Button>

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
