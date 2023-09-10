import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container,Snackbar } from '@mui/material';
import { AccountCircle, Email, Phone } from '@mui/icons-material';
import axios from 'axios';

function SignUpForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/register', formData);
      console.log(response.data);
      // Handle success or redirect to another page
      setSuccessMessage(' registration successfully!');
    setIsSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      // Handle error, show an error message, etc.
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <AccountCircle fontSize="small" color="action" />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              required
              InputProps={{
                startAdornment: <Email fontSize="small" color="action" />,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: <Phone fontSize="small" color="action" />,
              }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginTop: '20px' }}
        >
          Sign Up
        </Button>
      </form>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={4000} // Adjust the duration as needed
        onClose={handleSnackbarClose}
        message={successMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  );
}

export default SignUpForm;
