import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, MenuItem,TextField, Button, Paper,Snackbar } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import axios from 'axios';

function CategoryAndSubcategoryPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };
  // Fetch categories on component mount
  useEffect(() => {
    axios.get('/category')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Fetch subcategories for the selected category
  useEffect(() => {
    if (selectedCategory) {
      axios.get(`/categories/${selectedCategory}/subcategories`)
        .then((response) => {
          setSubcategories(response.data);
        })
        .catch((error) => {
          console.error('Error fetching subcategories:', error);
        });
    }
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubcategoryNameChange = (event) => {
    setSubcategoryName(event.target.value);
  };

  const handleSubcategoryImageChange = (event) => {
    setSubcategoryImage(event.target.files[0]);
  };

  const handleAddSubcategory = async () => {
    if (!selectedCategory || !subcategoryName || !subcategoryImage) {
      console.error('Please select a category, provide a subcategory name, and upload an image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', subcategoryName);
      formData.append('image', subcategoryImage);

      const response = await axios.post(`/categories/${selectedCategory}/subcategories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Category created successfully!');
      setIsSnackbarOpen(true);
      console.log('subcategories created:', response.data);

      // Clear input fields and update the subcategories list
      setSubcategoryName('');
      setSubcategoryImage(null);
      setSubcategories([...subcategories, response.data]);
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Add Subcategory
            </Typography>
            <TextField
              select
              label="Select a Category"
              variant="outlined"
              fullWidth
              value={selectedCategory}
              onChange={handleCategoryChange}
              margin="normal"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Subcategory Name"
              variant="outlined"
              fullWidth
              value={subcategoryName}
              onChange={handleSubcategoryNameChange}
              margin="normal"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleSubcategoryImageChange}
              style={{ display: 'none' }}
              id="subcategory-image-input"
            />
            <label htmlFor="subcategory-image-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddCircle />}
              >
                Upload Subcategory Image
              </Button>
            </label>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubcategory}
              style={{ marginTop: '16px' }}
            >
              Add Subcategory
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Subcategories
          </Typography>
          {subcategories.map((subcategory) => (
            <div key={subcategory._id} style={{ marginBottom: '20px' }}>
              <Typography variant="subtitle1">{subcategory.name}</Typography>
              <img
                src={`/images/${subcategory.image}`}
                alt={subcategory.name}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </Grid>
      </Grid>
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

export default CategoryAndSubcategoryPage;
