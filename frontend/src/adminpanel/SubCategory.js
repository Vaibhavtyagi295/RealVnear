import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function SubcategoryList() {
  const [subcategories, setSubcategories] = useState([]);

  // Function to fetch subcategories from your API
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Fetch subcategories on component mount
  useEffect(() => {
    fetchSubcategories();
  }, []);

  // Function to delete a subcategory by ID
  const handleDelete = async (subcategoryID) => {
    try {
      await axios.delete(`/subcategories/${subcategoryID}`);
      // Remove the deleted subcategory from the state
      setSubcategories((prevSubcategories) =>
        prevSubcategories.filter((subcategory) => subcategory._id !== subcategoryID)
      );
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Subcategories
      </Typography>
      <Paper elevation={3}>
        <List>
          {subcategories.map((subcategory) => (
            <ListItem key={subcategory._id}>
              <img
                src={`/images/${subcategory.image}`} // Provide the image URL from your API
                alt={subcategory.name}
                width="100"
                height="100"
              />
              <ListItemText primary={subcategory.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(subcategory._id)}
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

export default SubcategoryList;
