import React, { useState ,useEffect} from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Box,
  TextField,
  Menu,
  MenuItem,

} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Report,
  Share,

  Reply,
} from '@mui/icons-material';
import {
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import StarIcon from '@mui/icons-material/Star';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useParams } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';


const ProductDetailPage = () => {
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const history = useNavigate();

  const { id } = useParams(); 
  
    

  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    fetch('/category')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data); // Assuming the API returns an array of category names
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);
  
  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setReviews(data))
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }, [id]);
  
  
  const handleReviewSubmit = () => {
    if (newReview.name && newReview.rating > 0 && newReview.comment) {
      fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Assuming the API returns the newly created review
          const updatedReviews = [...reviews, data];
          setReviews(updatedReviews);
          setNewReview({
            name: '',
            rating: 0,
            comment: '',
          });
        })
        .catch((error) => {
          console.error('Error submitting review:', error);
        });
    }
  };
  

  // Assuming you have a function to fetch seller details by ID
const fetchSellerDetails = async (seller) => {
  try {
    const response = await fetch(`/seller/${seller}`); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
    console.log(data) // Assuming the response contains seller details
  } catch (error) {
    console.error('Error fetching seller details:', error);
    return null;
  }
};

const [anchorEl, setAnchorEl] = useState(null);

useEffect(() => {
  fetch(`/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(async (data) => {
      console.log('Fetched Product Data:', data);
      setProduct(data);

      // Fetch seller details and update the state with contactNumber
      const sellerDetails = await fetchSellerDetails(data.Seller);
      if (sellerDetails) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          sellerContactNumber: sellerDetails.contactNumber,
        }));
      }
    })
    .catch((error) => {
      console.error('Error fetching product:', error);
    });
}, [id]);

  
const handleWhatsAppClick = () => {
  const { sellerContactNumber } = product; // Get the seller's contact number from state

  if (sellerContactNumber) {
    const whatsappUrl = `https://wa.me/${sellerContactNumber}`;
    window.open(whatsappUrl, '_blank');
  } else {
    // Handle the case where the seller's contact number is not available
    console.error('Seller contact number not available.');
  }
};


 
  const handleLikeClick = (id) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === id) {
        const isLiked = !review.isLiked;
        return {
          ...review,
          isLiked,
          likes: isLiked ? review.likes + 1 : review.likes - 1,
        };
      }
      return review;
    });

    setReviews(updatedReviews);
  };

  const handleReplyClick = (id) => {
    console.log(`Replying to review with ID ${id}`);
  };
  const handleViewShopClick = () => {
    const { Seller } = product; // Assuming Seller contains the seller's ID
  
    if (Seller) {
      // Construct the URL for the seller's shop page
      const shopUrl = `/seller/${Seller}`;
      history(shopUrl);
    } else {
      // Handle the case where the seller ID is not available
      console.error('Seller ID not available.');
    }
  };
  

  const handleProductLikeClick = () => {
    const updatedProduct = {
      ...product,
      isLiked: !product.isLiked,
    };

    // Update the product state
  };
  
  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(window.location.href)}`;
    window.location.href = shareUrl;
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(shareUrl, '_blank');
  };

  const handleEmailShare = () => {
    const subject = 'Check out this product';
    const body = `I found this amazing product: ${product.name}. Check it out here: ${window.location.href}`;
    const shareUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = shareUrl;
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img src={`/images/${product.image}` } alt={product.name} style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" style={{ fontWeight: 'bold' }}>
  {categories.map((category, index) => (
    <span key={category._id}>
      {index > 0 && ', '}
      {category.name}
    </span>
  ))}
</Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            {product.price}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Average Rating: 
            <span style={{ color: 'red' }}>
              {'\u2605'.repeat(Math.floor(product.rating))}
            </span>
            <span style={{ color: 'grey' }}>
              {'\u2605'.repeat(5 - Math.floor(product.rating))}
            </span>
            ({product.numReviews} reviews)
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <IconButton onClick={handleProductLikeClick}>
              {product.isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton style={{ color: 'red' }}>
              <Report />
            </IconButton>
            <Button variant="contained" color="primary" onClick={handleWhatsAppClick}>
              <WhatsAppIcon /> Buy Now
            </Button>
            <Button variant="outlined" color="primary"   onClick={handleViewShopClick} style={{ marginLeft: '8px' }}>
              View Shop
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
          </div>
        </Grid>
      </Grid>
      <Typography variant="h6" color="textSecondary" style={{ marginTop: '32px' }}>
        Customer Reviews
      </Typography>

      {/* Existing Reviews */}
      {reviews.map((review) => (
        <Card key={review.id} style={{ marginTop: '16px' }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Avatar src="/user-avatar.jpg" alt="User" />
              <div style={{ marginLeft: '8px' }}>
                <Typography variant="body2">{review.name}</Typography>
                <Box display="flex" alignItems="center">
                  <StarIcon className={review.rating >= 4 ? 'red-star' : ''} style={{ marginRight: '4px' }} />
                  <Typography variant="body2" color="textSecondary">
                    {review.rating}
                  </Typography>
                </Box>
              </div>
            </div>
            <Typography variant="body1" paragraph>
              {review.comment}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => handleLikeClick(review.id)}>
                {review.isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <IconButton onClick={() => handleReplyClick(review.id)}>
                <Reply />
              </IconButton>
              <Typography variant="body2" color="textSecondary">
          {isNaN(review.likes) ? 0 : review.likes} Likes
        </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleReplyClick(review.id)}>
              Reply
            </Button>
          </CardActions>
        </Card>
        
      ))}
           {/* New Review Section */}
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            Write a Review
          </Typography>
          <TextField
            label="Your Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          />
          <Box display="flex" alignItems="center">
            <Typography variant="body2">Rating:</Typography>
            <IconButton
              onClick={() =>
                setNewReview({ ...newReview, rating: newReview.rating > 1 ? newReview.rating - 1 : 1 })
              }
            >
              <StarIcon />
            </IconButton>
            <Typography variant="body2">{newReview.rating}</Typography>
            <IconButton
              onClick={() =>
                setNewReview({ ...newReview, rating: newReview.rating < 5 ? newReview.rating + 1 : 5 })
              }
            >
              <StarIcon />
            </IconButton>
          </Box>
          <TextField
            label="Your Review"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleReviewSubmit}
          >
            Submit Review
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default ProductDetailPage;
