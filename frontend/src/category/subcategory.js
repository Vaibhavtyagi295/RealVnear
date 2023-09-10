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
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';

const theme = createTheme();

const SubcategoryPage = () => {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/category/${categoryId}/subcategories`)
      .then((response) => response.json())
      .then((data) => {
        setSubcategories(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching subcategories:', error);
        setIsLoading(false);
      });
  }, [categoryId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box mt={6}>
          {isLoading ? (
            <Typography variant="h5">Loading...</Typography>
          ) : subcategories.length === 0 ? (
            <Typography variant="h5">No subcategories available in your location.</Typography>
          ) : (
            <Grid container spacing={4}>
              {subcategories.map((subcategory) => (
                <Grid item key={subcategory._id} xs={12} sm={6} md={4}>
                  <Link
                    to={`/category/${categoryId}/subcategory/${subcategory._id}/sellers`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card elevation={3}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`/images/${subcategory.image}`}
                        alt={subcategory.name}
                      />
                      <Typography variant="h6" align="center" style={{ padding: '8px' }}>
                        {subcategory.name}
                      </Typography>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
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

export default SubcategoryPage;
