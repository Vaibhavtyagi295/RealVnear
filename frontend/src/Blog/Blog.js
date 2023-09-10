import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/blogs'); // Replace with your actual API endpoint
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f2f2f2' }}>
      <Container style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Typography variant="h1" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontSize: '24px', marginBottom: '1rem' }}>
          Top Blogs
        </Typography>
        <Grid container spacing={3}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardMedia
                  style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio for the image
                  image={blog.image}
                  title={blog.title}
                />
                <CardContent style={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {blog.title}
                  </Typography>
                  <Typography>
                    {blog.content}
                  </Typography>
                </CardContent>
                <IconButton style={{ alignSelf: 'flex-end', marginTop: '-1.5rem' }} aria-label="Like">
                  <FavoriteIcon color="secondary" />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default BlogPage;
