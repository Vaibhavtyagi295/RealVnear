import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import ShopIcon from '@mui/icons-material/Shop';
import { Link } from 'react-router-dom';

// Import your platform image

const JoinUsPage = () => {
  const [language, setLanguage] = useState('English'); // Default language is English

  const handleChangeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Define the platform description based on the selected language
  const platformDescriptions = {
    English:
      "Welcome to our platform where you can open your shop and sell products and services in your location.",
    Gujarati: "આમાં આપની દુકાન ખોલી શકો છો અને આપના સ્થાને મોકલી શકો છો અને પ્રોડક્ટ્સ અને સેવાઓ વેચી શકો છો.",
    Hindi:
      "हमारे प्लेटफार्म में आप अपनी दुकान खोल सकते हैं और अपने स्थान पर उत्पाद और सेवाएं बेच सकते हैं।",
  };

  return (
    <Container maxWidth="md" style={styles.container}>
      <img src={''} alt="Platform" style={styles.platformImage} />
      <ShopIcon style={styles.icon} color="primary" fontSize="large" />
      <Typography variant="h4" component="h1" gutterBottom>
        Join Us and Open Your Shop!
      </Typography>
      <Typography variant="body1" paragraph>
        {platformDescriptions[language]}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to="/SellerRegistration"
      >
        Join Us
      </Button>
      <div style={styles.languageSelection}>
        <LanguageIcon style={styles.languageIcon} fontSize="small" color="primary" />
        <Button
          style={styles.languageButton}
          onClick={() => handleChangeLanguage('Gujarati')}
        >
          Gujarati
        </Button>
        <Button
          style={styles.languageButton}
          onClick={() => handleChangeLanguage('Hindi')}
        >
          Hindi
        </Button>
        <Button
          style={styles.languageButton}
          onClick={() => handleChangeLanguage('English')}
        >
          English
        </Button>
      </div>
    </Container>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '2rem',
  },
  platformImage: {
    maxWidth: '100%',
    marginBottom: '1rem',
    borderRadius: '8px', // Optional: Add border-radius to the image
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  languageSelection: {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  languageIcon: {
    marginRight: '0.5rem',
  },
  languageButton: {
    textTransform: 'none',
    marginRight: '0.5rem',
  },
};

export default JoinUsPage;
