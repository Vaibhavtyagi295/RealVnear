import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

function SellerDashboard() {
  const { sellerId } = useParams();
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    location: 'Your Default Location',
    deliveryTime: '',
    image: null,
  });

  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
  });

  const [isCreateBlogModalOpen, setIsCreateBlogModalOpen] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          axios
            .get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            .then((response) => {
              const userLocation = response.data.display_name;
              setProductFormData({
                ...productFormData,
                location: userLocation,
              });
            })
            .catch((error) => {
              console.error('Error fetching user location:', error);
            });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value,
    });
  };

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setBlogFormData({
      ...blogFormData,
      [name]: value,
    });
  };

  const handleProductImageChange = (e) => {
    setProductFormData({
      ...productFormData,
      image: e.target.files[0],
    });
  };

  const createProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', productFormData.name);
      formData.append('description', productFormData.description);
      formData.append('price', productFormData.price);
      formData.append('category', productFormData.category);
      formData.append('location', productFormData.location);
      formData.append('deliveryTime', productFormData.deliveryTime);
      formData.append('image', productFormData.image);

      const response = await axios.post(`/products/${sellerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product created:', response.data);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const openCreateBlogModal = () => {
    setIsCreateBlogModalOpen(true);
  };

  const closeCreateBlogModal = () => {
    setIsCreateBlogModalOpen(false);
  };

  const createBlog = async () => {
    try {
      const { title, content } = blogFormData;

      const response = await axios.post(`/seller/${sellerId}/blogs`, {
        title,
        content,
      });

      console.log('Blog created:', response.data);

      setBlogFormData({
        title: '',
        content: '',
      });

      closeCreateBlogModal();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                name="name"
                value={productFormData.name}
                onChange={handleProductChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={productFormData.description}
                onChange={handleProductChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                value={productFormData.price}
                onChange={handleProductChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={productFormData.category}
                onChange={handleProductChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={productFormData.location}
                onChange={handleProductChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Delivery Time"
                name="deliveryTime"
                value={productFormData.deliveryTime}
                onChange={handleProductChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={createProduct}>
                Create Product
              </Button>
              <Button variant="contained" color="primary" onClick={openCreateBlogModal}>
                Create Blog
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Move the Dialog component inside the Container */}
      <Dialog
        open={isCreateBlogModalOpen}
        onClose={closeCreateBlogModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Blog</DialogTitle>
        <DialogContent>
          <TextField
            label="Blog Title"
            name="title"
            value={blogFormData.title}
            onChange={handleBlogChange}
            fullWidth
          />
          <TextField
            label="Blog Content"
            name="content"
            value={blogFormData.content}
            onChange={handleBlogChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateBlogModal} color="primary">
            Cancel
          </Button>
          <Button onClick={createBlog} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SellerDashboard;
