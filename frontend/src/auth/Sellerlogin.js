import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const formStyle = {
  width: '100%',
  marginTop: '1rem',
};

const submitButtonStyle = {
  marginTop: '1rem',
};

const SellerLoginForm = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    contactNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/seller-login', formData);
      console.log('Login successful:', response.data);
  
      // Save seller data in localStorage
      localStorage.setItem('seller', JSON.stringify({
        sellertoken: response.data.token,
        sellerId: response.data.sellerId,
      }));
  
      // Redirect to the seller dashboard upon successful login
      history(`/Seller-dashboard/${response.data.sellerId}`);
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error here, e.g., show an error message
    }
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3}>
        <div style={formContainerStyle}>
          <Typography variant="h5">Seller Login</Typography>
          <form style={formStyle} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={submitButtonStyle}
            >
              Log In
            </Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default SellerLoginForm;
