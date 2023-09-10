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
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function BlogList({ sellerId }) {
  const [blogs, setBlogs] = useState([]);

  // Function to fetch blogs for the seller
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, [sellerId]);

  // Function to delete a blog by ID
  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`/blogs/${blogId}`);
      // Remove the deleted blog from the state
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="blog-list-container">
      <Typography variant="h5" gutterBottom>
        Blogs
      </Typography>
      <Paper elevation={3}>
        <List>
          {blogs.map((blog) => (
            <ListItem key={blog._id}>
              <ListItemText primary={blog.title} secondary={blog.content} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(blog._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}

export default BlogList;
