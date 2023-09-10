import React ,{useState,useEffect} from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import axios from "axios"
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate} from "react-router-dom"
const theme = createTheme();

const LandingPage = () => {
  const navigate = useNavigate();


  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 100,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [images, setImages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setIsButtonClicked(true);
    navigate('/SellerRegistration');
  };
  useEffect(() => {
  
    axios.get('/images')
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setUserLocation(JSON.parse(savedLocation));
      } else if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);
            // Save user location to local storage
            localStorage.setItem('userLocation', JSON.stringify(location));
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      }
    }, []);
   
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        style={{
          background: `url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover no-repeat`,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h2" align="center" color="primary" gutterBottom>
            Welcome to Vnear.in
            </Typography>
            <Typography variant="h5" align="center" color="#fff" paragraph>
            Discover the best services and products tailored just for you near you
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{
                transition: 'background 0.3s',
                '&:hover': {
                  backgroundColor: '#ff5722',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/SellerRegistration')}
              style={{
                marginTop: '1rem',
                transition: 'background 0.3s',
                backgroundColor: '#ff5722',
                backgroundColor: isButtonClicked ? '#ff5722' : '', // Change background color when clicked
                '&:hover': {
                  backgroundColor: '#ff5722',
                },
              }}
            >
              Become a Seller
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Slideable Image Card Carousel */}
      <Container style={{ marginTop: '2rem' }}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <a href={image.link}>
                <img src={`/images/${image.image}`} alt={`Image ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '200px', height: 'auto' }} />
              </a>
            </div>
          ))}
        </Slider>
      </Container>
    </ThemeProvider>
  );
};

export default LandingPage;
