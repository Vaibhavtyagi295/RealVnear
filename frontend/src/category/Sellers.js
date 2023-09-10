import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Grid,
  Button,
  IconButton,
  Divider,
  Box,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { Favorite as FavoriteIcon, Send as SendIcon, Chat as ChatIcon } from '@mui/icons-material';

function App() {
  const { categoryId, subcategoryId } = useParams();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Top Rated');
  const subcategory = 'Your Subcategory';
  const [location, setLocation] = useState('');
  const API_URL = `/category/${categoryId}/subcategory/${subcategoryId}/sellers`;


  useEffect(() => {
    // Use the Geolocation API to get the user's coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Use Nominatim API for reverse geocoding
        axios
          .get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then((response) => {
            const userLocation = response.data.display_name; // Use the display_name as the location
            setLocation(userLocation);
          })
          .catch((error) => {
            console.error('Error fetching user location:', error);
            // Handle the error here and keep the default location
            setLocation('Your Default Location');
          });
      }, (error) => {
        console.error('Error getting user location:', error);
        // Handle the error here and keep the default location
        setLocation('Your Default Location');
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle the case where geolocation is not supported and keep the default location
      setLocation('Your Default Location');
    }
  }, []);




  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setSellers(response.data);
        setFilteredSellers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    phoneNumber: '',
    question: '',
  });

  const openInquiryModal = () => {
    setInquiryModalOpen(true);
  };

  const closeInquiryModal = () => {
    setInquiryModalOpen(false);
  };

  const handlePhoneNumberChange = (event) => {
    setInquiryData({
      ...inquiryData,
      phoneNumber: event.target.value,
    });
  };

  const handleQuestionChange = (event) => {
    setInquiryData({
      ...inquiryData,
      question: event.target.value,
    });
  };

  const sendInquiry = (seller) => {
    const inquiryDataToSend = {
      phoneNumber: inquiryData.phoneNumber,
      question: inquiryData.question,
    };
  
    axios
      .post(`/seller/${seller._id}/inquiries`, inquiryDataToSend)
      .then((response) => {
        // Handle successful inquiry submission
        console.log(`Inquiry sent to ${seller.shopName}`);
      })
      .catch((error) => {
        // Handle error
        console.error('Error sending inquiry:', error);
      });
  
    // Close the modal
    closeInquiryModal();
  };
  
  const handleLike = (seller) => {
    axios
      .post(`/seller/${seller._id}/likes`)
      .then((response) => {
        // Handle successful liking of seller
        console.log(`Liked ${seller.shopName}`);
      })
      .catch((error) => {
        // Handle error
        console.error('Error liking seller:', error);
      });
  };
  
  const handleWhatsApp = (contactNumber) => {
    if (contactNumber) {
      const whatsappUrl = `https://wa.me/${contactNumber}`;
      window.open(whatsappUrl, '_blank');
    } else {
      console.error('Seller contact number not available.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0', fontFamily: 'Arial' }}>
       {location}
      </Typography>

      <ButtonGroup
        variant="outlined"
        color="primary"
        aria-label="Filter"
        style={{ marginBottom: '20px' }}
      >
        <Button
          onClick={() => setSelectedFilter('Top Rated')}
          variant={selectedFilter === 'Top Rated' ? 'contained' : 'outlined'}
        >
          Top Rated
        </Button>
      </ButtonGroup>

      <Grid container spacing={3}>
        {filteredSellers.map((seller) => (
          <Grid item xs={12} sm={6} md={4} key={seller._id}>
            <Card style={{ marginTop: '20px' }}>
              <Link to={`/seller/${seller._id}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={seller.imageUrl}
                  alt={seller.shopName}
                />
              </Link>
              <CardContent>
                <Typography variant="h6" component="div">
                  {seller.shopName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Category: {seller.category}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Rating: <StarIcon rating={seller.rating} />
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Years In Business: {seller.yearsInBusiness}
                </Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Box display="flex" justifyContent="space-between">
                  <div>
                    <IconButton color="primary" aria-label="Add to favorites" onClick={() => handleLike(seller)}>
                      <FavoriteIcon />
                    </IconButton>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      onClick={openInquiryModal}
                    >
                      Send Inquiry
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<ChatIcon />}
                      onClick={() => handleWhatsApp(seller.contactNumber)}
                    >
                      Chat
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Inquiry Modal */}
      <Dialog open={inquiryModalOpen} onClose={closeInquiryModal}>
        <DialogTitle>Send Inquiry</DialogTitle>
        <DialogContent>
          <TextField
            label="Phone Number"
            fullWidth
            value={inquiryData.phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <TextField
            label="Question"
            multiline
            rows={4}
            fullWidth
            value={inquiryData.question}
            onChange={handleQuestionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInquiryModal} color="primary">
            Cancel
          </Button>
          <Button onClick={() => sendInquiry(filteredSellers[0])} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
