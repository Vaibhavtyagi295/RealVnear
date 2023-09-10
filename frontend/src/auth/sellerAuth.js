import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar
} from '@mui/material';
import axios from 'axios';

const SellerRegistrationPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const [formData, setFormData] = useState({
    shopName: '',
    yearsInBusiness: '',
    shopDescription: '',
    category: '',
    subcategories: [],
    contactNumber: '',
    password: '',
    shopOpenTime: '', // Add the new field for shopOpenTime
    shopCloseTime: '', // Add the new field for shopCloseTime
    price: 0, // Add the new field for price with an initial value (modify as needed)
    fullAddress: '', 
    image:null
    // Add the new field for fullAddress
  });

  const [categories, setCategories] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  useEffect(() => {
    // Fetch categories from your API
    fetch('/category')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched categories:', data);
        setCategories(data);
      })
      .catch((error) => console.error('Error fetching categories:', error));

    // Initialize subcategory options
   

    // Listen for changes in the selected category
    if (formData.category) {
      fetch(`/category/${formData.category}/subcategories`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched subcategories:', data);
          console.log('Fetched categories:', formData.category);
          setSubcategoryOptions(data);
        })
        .catch((error) => console.error('Error fetching subcategories:', error));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [imageFile, setImageFile] = useState(null);

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  setFormData({ ...formData, image: file });
};
  
const handleSubcategoryChange = (e) => {
  const selectedOptions = Array.isArray(e.target.value) ? e.target.value : [];
  setFormData({ ...formData, subcategories: selectedOptions });

  // Debugging: Log the selected subcategories and updated formData
  console.log('Selected Subcategories:', selectedOptions);
  console.log('Updated FormData:', { ...formData, subcategories: selectedOptions });
};






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
              setFormData((prevFormData) => ({
                ...prevFormData,
                fullAddress: userLocation, // Set fullAddress to the user's location
              }));
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
  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Create a FormData object to send the form data including the image
    const formDataToSend = new FormData();
    formDataToSend.append('shopName', formData.shopName);
    formDataToSend.append('yearsInBusiness', formData.yearsInBusiness);
    formDataToSend.append('shopDescription', formData.shopDescription);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('subcategories', formData.subcategories);
    formDataToSend.append('contactNumber', formData.contactNumber);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('shopOpenTime', formData.shopOpenTime);
    formDataToSend.append('shopCloseTime', formData.shopCloseTime);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('fullAddress', formData.fullAddress);
    formDataToSend.append('image', formData.image);

    // Send the form data to your API endpoint
    const response = await axios.post('/seller-register', formDataToSend);

    // Handle success, e.g., show a success message or redirect
    console.log('Seller registration successful', response.data);
    setSuccessMessage('Seller registration successfully!');
    setIsSnackbarOpen(true);
    // Reset the form after successful registration
    setFormData({
      shopName: '',
      yearsInBusiness: '',
      shopDescription: '',
      category: '',
      subcategories: [],
      contactNumber: '',
      password: '',
      shopOpenTime: '',
      shopCloseTime: '',
      price: '',
      fullAddress: '',
      image: null,
    });

    // You can add code here to handle success, such as displaying a success message or redirecting the user.
  } catch (error) {
    // Handle errors, e.g., show an error message to the user
    console.error('Error during seller registration', error);

    // You can add code here to handle errors, such as displaying an error message to the user.
  }
};


  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Seller Registration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Shop Name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Years in Business"
              name="yearsInBusiness"
              value={formData.yearsInBusiness}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Shop Description"
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Subcategories (Select multiple)</InputLabel>
              <Select
                label="Subcategories"
                name="subcategories" // Should match formData property name
                value={formData.subcategories}
                onChange={handleSubcategoryChange}
                multiple
                required
              >
                {subcategoryOptions && subcategoryOptions.length > 0 ? (
                  subcategoryOptions.map((subcategory) => (
                    <MenuItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No subcategories available</MenuItem>
                )}
              </Select>




            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Shop Open Time"
              name="shopOpenTime"
              value={formData.shopOpenTime}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Shop Close Time"
              name="shopCloseTime"
              value={formData.shopCloseTime}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Price per day"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
          <TextField
  variant="outlined"
  fullWidth
  label="Full Address"
  name="fullAddress"
  value={formData.fullAddress}
  onChange={handleChange}
  disabled // Add the disabled attribute to prevent editing
/>

          </Grid>
         <Grid item xs={12}>
<input
type="file"
accept="image/*"
onChange={handleImageChange}
/>
</Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Grid>
        </Grid>
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
};

export default SellerRegistrationPage;
