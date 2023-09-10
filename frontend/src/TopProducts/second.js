import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Rating,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

const theme = createTheme();

// Helper function to calculate distance between two sets of coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

const TopProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [displayCount, setDisplayCount] = useState(4);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });

  // Fetch user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  // Fetch products from an API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data); // Assuming the API response is an array of products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from an API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/category');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data); // Assuming the API response is an array of categories

        // Create a map of category IDs to category names
        const categoryMap = {};
        data.forEach((category) => {
          categoryMap[category._id] = category.name;
        });
        setCategoryNames(categoryMap);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Filter products by category
  const filterProductsByCategory = (category) => {
    if (category === 'All') {
      return products;
    }
    return products.filter((product) => product.category === category);
  };

  // Filter products by distance
  const filterProductsByDistance = () => {
    if (!userLocation.lat || !userLocation.lon) {
      return products; // User location not available, return all products
    }

    return products.filter((product) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        product.latitude,
        product.longitude
      );
      return distance <= 50; // Filter products within 50km radius
    });
  };

  const filteredProducts = filterProductsByCategory(selectedCategory);

  // Function to load more products
  const loadMoreProducts = () => {
    setDisplayCount(displayCount + 4); // Increase the display count by 4
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Our Best Top Products
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {filteredProducts.slice(0, displayCount).map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <Link to={`/ProductDetail/${product._id}`} className="link-no-decoration">
                  <Card elevation={3} component={Paper}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`images/${product.image}`}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {product.price}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {categoryNames[product.category] || 'Unknown'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Location: {product.location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Delivery Time: {product.deliveryTime}
                      </Typography>
                      <Box mt={1}>
                        <Rating
                          name={`rating-${product._id}`}
                          value={product.rating}
                          precision={0.1}
                          readOnly
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          {displayCount < filteredProducts.length && (
            <Box mt={2} display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={loadMoreProducts}>
                Show More
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default TopProductsPage;
