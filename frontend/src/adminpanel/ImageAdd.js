import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Paper, Grid, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

const UploadImagePage = () => {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file || !link) {
      setUploadMessage('Please select an image and provide a link.');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('link', link);

      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setUploadMessage('An error occurred while uploading the image and link.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Upload an Image and Link
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
          </Button>
        </label>
        <Typography variant="body2" color="error">
          {uploadMessage}
        </Typography>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Link"
              fullWidth
              variant="outlined"
              value={link}
              onChange={handleLinkChange}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: '20px' }}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Paper>
    </Container>
  );
};

export default UploadImagePage;
