import React, { useEffect } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';


function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token in localStorage and clear URL params
      localStorage.setItem('authToken', token);
      

      setTimeout(() => {
        navigate('/');
      }, 5000); // Adjust the delay duration as needed
        
      
      
       // Redirect to the main page
    }
  }, [navigate]);

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
