import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Grid,
  Card,
  CardMedia,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // Import Link from React Router

// Create a theme instance
const theme = createTheme();

const CategoryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Replace 'your_api_endpoint' with the actual API endpoint to fetch categories
    fetch('/category')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box mt={6}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Explore Our Categories
          </Typography>
          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item key={category._id} xs={12} sm={6} md={4}>
                {/* Use category._id as the categoryId */}
                <Link to={`/category/${category._id}/subcategories`} style={{ textDecoration: 'none' }}>
                  <Card elevation={3}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`/images/${category.image}`}
                      alt={category.name}
                    />
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={4} textAlign="center">
          <Button style={{ marginLeft: 'auto', marginRight: '1rem' }} variant="contained" color="primary">
            More
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleSidebar}
            style={{ marginLeft: 'auto', marginRight: '1rem' }}
          >
            All Popular Categories
          </Button>
        </Box>
        <Box mt={4}>
          {/* Add your All Product Categories content here */}
        </Box>
      </Container>
      <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
        <List>
          {categories.map((category) => (
            <ListItem button key={category._id}>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <style jsx>{`
        @media (max-width: 600px) {
          .MuiGrid-item {
            flex-basis: 50%;
            max-width: 50%;
          }
        }
      `}</style>
    </ThemeProvider>
  );
};

export default CategoryPage;
