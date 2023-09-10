import React, { useState } from 'react';
import { TextField, Button, Typography,Snackbar } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import axios from 'axios';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image);

      const response = await axios.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Category created successfully!');
      setIsSnackbarOpen(true);
      console.log('Category created:', response.data);
      // You can redirect to a different route or show a success message here.
    } catch (error) {
      console.error('Error creating category:', error);
      // Handle error and display an error message if needed.
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Add Category
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          margin="normal"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-input"
        />
        <label htmlFor="image-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<AddCircle />}
          >
            Upload Image
          </Button>
        </label>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!name || !image}
          style={{ marginTop: '16px' }}
        >
          Add Category
        </Button>
      </form>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={4000} // Adjust the duration as needed
        onClose={handleSnackbarClose}
        message={successMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </div>
  );
};

export default CategoryForm;
