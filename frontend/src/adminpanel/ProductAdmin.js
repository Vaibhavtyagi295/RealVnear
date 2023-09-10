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
  Button,
  CardActions,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function ProductList() {
  const [products, setProducts] = useState([]);

  // Function to fetch products from your API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to delete a product by ID
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/products/${productId}`);
      // Remove the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-list-container">
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>
      <Paper elevation={3}>
        <List>
          {products.map((product) => (
            <Card key={product._id} className="product-card">
              <CardMedia
                component="img"
                alt={product.name}
                height="140"
                image={product.image} // Replace with your image URL from the API
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Description: {product.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: ${product.price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {product.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {product.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Delivery Time: {product.deliveryTime}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(product._id)}
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

export default ProductList;
