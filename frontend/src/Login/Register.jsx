import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import background from '../assets/images/mode1.gif';

// Add glow, float, and pulse keyframes at the top
const glow = `
  @keyframes glow {
    0% { text-shadow: 0 0 10px rgba(0, 217, 255, 0.5), 0 0 20px rgba(0, 217, 255, 0.3); }
    50% { text-shadow: 0 0 20px rgba(0, 217, 255, 0.8), 0 0 30px rgba(0, 217, 255, 0.5); }
    100% { text-shadow: 0 0 10px rgba(0, 217, 255, 0.5), 0 0 20px rgba(0, 217, 255, 0.3); }
  }
`;

const float = `
  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
`;

const pulse = `
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 217, 255, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(0, 217, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 217, 255, 0); }
  }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '0',
  margin: '0',
  maxWidth: '100% !important',
  width: '100vw',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
    pointerEvents: 'none',
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '16px',
  maxWidth: '450px',
  width: '100%',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 217, 255, 0.5)',
  backgroundColor: 'rgba(44, 44, 84, 0.85)',
  border: '2px solid #00d9ff',
  backdropFilter: 'blur(5px)',
  animation: 'pulse 2s infinite',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 30px',
  borderRadius: '8px',
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '14px',
  letterSpacing: '1px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: '#00d9ff',
    transform: 'scaleX(0)',
    transformOrigin: 'right',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 7px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 217, 255, 0.3)',
    '&::after': {
      transform: 'scaleX(1)',
      transformOrigin: 'left',
    }
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: 'rgba(22, 22, 42, 0.4)',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.3s ease',
    '& fieldset': { 
      borderColor: 'rgba(0, 217, 255, 0.6)',
      borderWidth: '2px',
    },
    '&:hover fieldset': { 
      borderColor: 'rgba(0, 217, 255, 0.8)',
    },
    '&.Mui-focused fieldset': { 
      borderColor: '#00d9ff',
      borderWidth: '2px',
      boxShadow: '0 0 8px rgba(0, 217, 255, 0.6)',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(0, 217, 255, 0.8)',
  },
  '& .MuiInputBase-input': {
    padding: '16px',
    color: '#fff',
    fontSize: '16px',
    caretColor: '#00d9ff',
  }
}));

const GlowingTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  color: '#ffffff',
  textShadow: '0 0 10px rgba(0, 217, 255, 0.5), 0 0 20px rgba(0, 217, 255, 0.3)',
  animation: 'glow 2s infinite ease-in-out, float 6s infinite ease-in-out',
  letterSpacing: '2px',
  textAlign: 'center',
}));

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/users/register', formData);
      setMessage(response.data.message);
      setSuccess(true);
      setError('');
      // Clear the form
      setFormData({ username: '', password: '' });
      // After 2 seconds, redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data.message || 'Error registering');
      setSuccess(false);
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Add useEffect hook for global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      ${glow} 
      ${float} 
      ${pulse}
      body, html {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        width: 100%;
        max-width: 100vw;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <StyledContainer>
      <StyledPaper elevation={6}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <GlowingTitle variant="h3" sx={{ mb: 1 }}>
                Register
              </GlowingTitle>
            </Box>
            
            <StyledTextField
              fullWidth
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              InputProps={{
                sx: { color: '#fff' },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'rgba(0, 217, 255, 0.8)' }}>
                    <Box sx={{ fontSize: '14px', mr: 1 }}>👤</Box>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{
                shrink: true,
                sx: { color: 'rgba(0, 217, 255, 0.8)' }
              }}
            />
            
            <StyledTextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              InputProps={{
                sx: { color: '#fff' },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'rgba(0, 217, 255, 0.8)' }}>
                    <Box sx={{ fontSize: '14px', mr: 1 }}>🔑</Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'rgba(0, 217, 255, 0.8)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{
                shrink: true,
                sx: { color: 'rgba(0, 217, 255, 0.8)' }
              }}
            />
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  backgroundColor: 'rgba(211, 47, 47, 0.8)', 
                  color: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #f44336'
                }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success"
                sx={{
                  backgroundColor: 'rgba(46, 125, 50, 0.8)',
                  color: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #4caf50'
                }}
              >
                {message}
              </Alert>
            )}
            
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
              <StyledButton 
                type="submit"
                variant="contained"
                sx={{ 
                  bgcolor: '#2c2c54', 
                  color: '#ffffff',
                  border: '2px solid #00d9ff',
                  minWidth: '120px',
                  '&:hover': { 
                    bgcolor: 'rgba(64, 64, 122, 0.9)',
                    boxShadow: '0 0 15px rgba(0, 217, 255, 0.5)' 
                  }
                }}
              >
                Register
              </StyledButton>
              
              <StyledButton 
                onClick={handleLoginRedirect}
                variant="outlined"
                sx={{ 
                  color: '#00d9ff', 
                  borderColor: '#00d9ff',
                  minWidth: '120px',
                  '&:hover': { 
                    borderColor: '#00aaff', 
                    color: '#00aaff',
                    backgroundColor: 'rgba(0, 217, 255, 0.1)'
                  } 
                }}
              >
                Back to Login
              </StyledButton>
            </Stack>
          </Stack>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Register;
