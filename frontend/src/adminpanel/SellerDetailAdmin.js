import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function SellerList() {
  const [sellers, setSellers] = useState([]);

  // Function to fetch seller details from your API
  const fetchSellerDetails = async () => {
    try {
      const response = await axios.get('/sellers');
      setSellers(response.data);
    } catch (error) {
      console.error('Error fetching seller details:', error);
    }
  };

  // Fetch seller details on component mount
  useEffect(() => {
    fetchSellerDetails();
  }, []);

  // Function to delete a seller by ID
  const handleDelete = async (sellerId) => {
    try {
      await axios.delete(`/sellers/${sellerId}`);
      // Remove the deleted seller from the state
      setSellers((prevSellers) =>
        prevSellers.filter((seller) => seller._id !== sellerId)
      );
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  return (
    <div className="seller-list-container">
      <Typography variant="h5" gutterBottom>
        Seller Details
      </Typography>
      <Paper elevation={3}>
        <List>
          {sellers.map((seller) => (
            <Card key={seller._id} className="seller-card">
              <CardContent className="seller-details">
                <img
                  src="/placeholder-image.jpg" // Replace with the seller's image URL
                  alt={`Image of ${seller.shopName}`}
                  className="seller-image"
                />
                <Typography variant="h6" component="div">
                  {seller.shopName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Years in Business: {seller.yearsInBusiness}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Shop Description: {seller.shopDescription}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {seller.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Subcategories: {seller.subcategories.join(', ')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contact Number: {seller.contactNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Shop Open Time: {seller.shopOpenTime}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Shop Close Time: {seller.shopCloseTime}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: {seller.price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Full Address: {seller.fullAddress}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(seller._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </List>
      </Paper>
    </div>
  );
}

export default SellerList;
