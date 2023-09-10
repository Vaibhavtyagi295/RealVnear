import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Alert from '@mui/material/Alert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import {

  Share,


} from '@mui/icons-material';


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

const ShopDetail = () => {
  const { id } = useParams();
  const [shopData, setShopData] = useState({});
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });


  useEffect(() => {
    // Get user's location using Geolocation API
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

  useEffect(() => {
    // Replace with your API endpoint URL
    axios
      .get(`/seller/${id}`)
      .then((response) => {
        const shop = response.data;
        // Check if user location is available
        if (userLocation.lat && userLocation.lon) {
          // Calculate distance between user and shop
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            shop.latitude,
            shop.longitude
          );
          // Check if shop is within 50km radius
          if (distance <= 150) {
            setShopData(shop);
          } else {
            // Shop is outside the 50km radius
            setShopData(shop);
          }
        } else {
          // User location is not available, set shop data without filtering
          setShopData(shop);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id, userLocation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!shopData) {
    return <div>Shop not found within 50km radius.</div>;
  }

  const handleWhatsApp = () => {
    const { contactNumber } = shopData;

    if (contactNumber) {
      const whatsappUrl = `https://wa.me/${contactNumber}`;
      window.open(whatsappUrl, '_blank');
    } else {
      console.error('Seller contact number not available.');
    }
  };
  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleWhatsAppShare = () => {
    const { contactNumber } = shopData;

    if (contactNumber) {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(
        `Check out this shop: ${window.location.href}`
      )}`;
      window.open(shareUrl, '_blank');
    } else {
      console.error('Seller contact number not available.');
    }
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(shareUrl, '_blank');
  };

  const handleEmailShare = () => {
    const subject = 'Check out this shop';
    const body = `I found this amazing shop: ${shopData.shopName}. Check it out here: ${window.location.href}`;
    const shareUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = shareUrl;
  };


  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Avatar
                src={`/images/${shopData.image}`}
                alt={shopData.shopName}
                sx={{ width: 150, height: 150 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4">{shopData.shopName}</Typography>
              <Typography variant="subtitle1">
                <Rating
                  name="shop-rating"
                  value={shopData.rating}
                  precision={0.5}
                  readOnly
                />
                {shopData.rating}
              </Typography>
              <Typography variant="subtitle1">
                <LocationOnIcon fontSize="small" />
                {shopData.fullAddress}
              </Typography>
              <Typography variant="subtitle1">
                Years in Business: {shopData.yearsInBusiness}
              </Typography>
              <Typography variant="subtitle1">
              Price per day ₹{shopData.price}
</Typography>

              <Typography variant="subtitle1">
                Category: {shopData.category}
              </Typography>
              <Button
           
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleWhatsApp}
              >
                   <WhatsAppIcon/>
                Contact Seller
              </Button>
              <IconButton onClick={handleShareClick}>
                <Share />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleShareClose}
              >
                <MenuItem onClick={handleWhatsAppShare}>
                  <WhatsappIcon size={32} round={true} />
                </MenuItem>
                <MenuItem onClick={handleFacebookShare}>
                  <FacebookIcon size={32} round={true} />
                </MenuItem>
                <MenuItem onClick={handleEmailShare}>
                  <EmailIcon size={32} round={true} />
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
            
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Shop Description:</Typography>
          <Typography variant="body1">{shopData.shopDescription}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Contact Information:</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Contact Number:"
                secondary={shopData.contactNumber}
              />
              <IconButton
                color="primary"
                aria-label="Send WhatsApp message"
                onClick={handleWhatsApp}
              >
                <WhatsAppIcon />
              </IconButton>
            </ListItem>
            <ListItem>
              <ListItemText primary="Email:" secondary={shopData.email} />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Shop Hours:</Typography>
          <Typography variant="body1">
            Open: {shopData.shopOpenTime} - Close: {shopData.shopCloseTime}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ShopDetail;
