import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  IconButton,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Sidebar from './Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

// Sample data for the chart
const initialData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 50 },
  { name: 'Mar', value: 40 },
];

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const chartWidth = isMobile ? window.innerWidth * 0.9 : 500;
  const chartHeight = isMobile ? 300 : 500;

  const [productData, setProductData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0); // State for total products
  const [userData, setUserData] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0); // State for total users
  const [totalSellers, setTotalSellers] = useState(0); // State for total sellers

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get('/products'); // Replace with your API endpoint for products
        setProductData(productResponse.data);

        const userResponse = await axios.get('/users'); // Replace with your API endpoint for users
        setUserData(userResponse.data);
        setTotalUsers(userResponse.data.length);

        const sellerResponse = await axios.get('/sellers'); // Replace with your API endpoint for sellers
        setSellerData(sellerResponse.data);
        setTotalSellers(sellerResponse.data.length);

        // Calculate and set the total number of products
        setTotalProducts(productResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Map the fetched product data to the chart data
  const productChartData = productData.map((product, index) => ({
    name: `Product ${index + 1}`,
    value: product.location, // Replace with the actual property you want to display
  }));

  // Map the fetched user data to the chart data
  const userChartData = userData.map((user, index) => ({
    name: `User ${index + 1}`,
    value: user.username, // Replace with the actual property you want to display
  }));

  // Map the fetched seller data to the chart data
  const sellerChartData = sellerData.map((seller, index) => ({
    name: `Seller ${index + 1}`,
    value: seller.shopName, // Replace with the actual property you want to display
  }));

  return (
    <Container>
      <Sidebar />
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h5" component="h2" gutterBottom>
              Line Chart (Products)
            </Typography>
            <LineChart width={chartWidth} height={chartHeight} data={productChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <Tooltip />
              <Legend />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h5" component="h2" gutterBottom>
              Line Chart (Users)
            </Typography>
            <LineChart width={chartWidth} height={chartHeight} data={userChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h5" component="h2" gutterBottom>
              Line Chart (Sellers)
            </Typography>
            <LineChart width={chartWidth} height={chartHeight} data={sellerChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="value" stroke="#ffc658" />
              <Tooltip />
              <Legend />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Total Products"
              action={
                <IconButton aria-label="menu">
                  <MenuIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="h3">{totalProducts}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Total Users"
              action={
                <IconButton aria-label="menu">
                  <MenuIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="h3">{totalUsers}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Total Sellers"
              action={
                <IconButton aria-label="menu">
                  <MenuIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="h3">{totalSellers}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {/* Add more cards or components as needed */}
      </Grid>
    </Container>
  );
}

function App() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default App;
