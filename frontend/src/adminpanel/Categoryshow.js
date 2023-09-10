import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminPanel() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the server
    fetch('/category')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleDelete = (categoryId) => {
    // Send a DELETE request to your server to delete the category by ID
    fetch(`/category/${categoryId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // If the deletion was successful, update the state to remove the deleted category
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== categoryId)
          );
        } else {
          console.error('Failed to delete category');
          // Handle the error as needed
        }
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        // Handle the error as needed
      });
  };
  

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel - Categories
      </Typography>
      <div>
        {categories.map((category) => (
          <Card key={category._id} variant="outlined" style={{ marginBottom: '16px' }}>
            <CardContent>
              <img src={`/images/${category.image}`} alt={category.name} style={{ maxWidth: '100%' }} />
              <Typography variant="h6">{category.name}</Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(category._id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default AdminPanel;
