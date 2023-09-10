import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

function UserDetails() {
  const [users, setUsers] = useState([]);

  // Function to fetch user details from your API
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="user-details-container">
      <Typography variant="h5" gutterBottom>
        User Details
      </Typography>
      <Paper elevation={3}>
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card className="user-card">
                <CardContent>
                  <Typography variant="h6" component="div">
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Email: {user.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Contact Number: {user.contactNumber}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
}

export default UserDetails;
