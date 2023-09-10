import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  LocalAtm as LocalAtmIcon,
  PhoneAndroid as PhoneAndroidIcon,
} from '@mui/icons-material';

const theme = createTheme();

const BillsRechargePage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Bills & Recharge
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Pay Your Bills and Recharge Here
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <LocalAtmIcon fontSize="large" color="primary" />
                  <Typography variant="h6">Electricity Bill</Typography>
                  <Typography variant="subtitle1">
                    Pay your monthly electricity bill online.
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button variant="contained" color="primary">
                    Pay Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <PhoneAndroidIcon fontSize="large" color="primary" />
                  <Typography variant="h6">Mobile Recharge</Typography>
                  <Typography variant="subtitle1">
                    Recharge your mobile phone instantly.
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button variant="contained" color="primary">
                    Recharge Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            {/* Add more bill payment options as needed */}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

const TravelBookingsPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Travel Bookings
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Explore and Book Your Travel Plans
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <FlightIcon fontSize="large" color="primary" />
                  <Typography variant="h6">Flight Booking</Typography>
                  <Typography variant="subtitle1">
                    Book your next flight with ease.
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button variant="contained" color="primary">
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <HotelIcon fontSize="large" color="primary" />
                  <Typography variant="h6">Hotel Reservations</Typography>
                  <Typography variant="subtitle1">
                    Find the perfect hotel for your stay.
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button variant="contained" color="primary">
                    Reserve Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            {/* Add more travel booking options as needed */}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

const CombinedPage = () => {
  return (
    <div>
      <BillsRechargePage />
      <TravelBookingsPage />
    </div>
  );
};

export default CombinedPage;
