import React, { useState } from 'react';
import { Button, Container, CssBaseline, TextField, Typography, Grid, Avatar, Link } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import axios from 'axios'; // For making API requests
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate(); 
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/login', { username, password });
      const { token,role } = response.data;

      console.log(role)
      // Store the token in localStorage or state for authentication
      // Redirect to the dashboard or another page upon successful login
      localStorage.setItem('userData', JSON.stringify({ token, role }));

    
      if (role === 'admin') {
        history('/Dashboard'); // Redirect to admin dashboard
      } else {
        history('/'); // Redirect to user dashboard (you can define this route)
      }
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="login-container">
        <Avatar className="avatar">
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className="login-form" onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit-button"
          >
            Sign In
          </Button>
          {error && <p className="error-message">{error}</p>}
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Login;
