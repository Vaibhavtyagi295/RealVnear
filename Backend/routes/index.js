var express = require('express');
var router = express.Router();
const User = require("./users"); // Import your user model
const jwt = require("jsonwebtoken");
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require("multer")
const {Category, Subcategory }  = require("./Categoriescreate.js");
const Seller  = require("./Seller.js");
const Product = require('./Product.js');
const Blog = require("./Blog")
const Image = require("./image")
const Review = require("./Review")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("hello")
});
const secretKey = "your-secret-key";


router.post("/register", async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ username, email, contactNumber, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: "1h" });

    // Return the token to the client
    res.status(201).json({ message: "Registration successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
});
// Create a GET route to fetch all user details
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude the password field
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});




router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });

    // Send both the token and role to the frontend
    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination directory for uploaded images
    cb(null, 'public/images'); // Adjust the path as needed
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage: storage });

// Create a new category
router.post('/categories', upload.single('image'), async (req, res) => {
  const { name } = req.body;

  try {
    const category = new Category({
      name: name,
      image:  req.file.filename, // Assuming the field name for the image is 'image'
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    console.log(err)
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
});

router.get('/category', (req, res) => {
  Category.find()
  
    .then((categories) => {
      console.log('Request URL:', req.url);

      res.json(categories);
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    });
});

router.delete('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Find and delete the category by ID
    await Category.findByIdAndDelete(categoryId);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});


router.post('/categories/:categoryId/subcategories', upload.single('image'), async (req, res) => {
  const categoryId = req.params.categoryId;
  const { name } = req.body;

  try {
    const subcategory = new Subcategory({
      name: name,
      category: categoryId,
      image: req.file.filename ,  
    });

    const savedSubcategory = await subcategory.save();

    // Update the parent category's subcategories array
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { subcategories: savedSubcategory._id } },
      { new: true }
    );

    res.status(201).json(savedSubcategory);
  } catch (err) {
    console.error('Error creating sub-category:', err);
    res.status(500).json({ error: 'Failed to create sub-category' });
  }
})

router.get('/category/:categoryId/subcategories', async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findById(categoryId).populate('subcategories');
    
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(category.subcategories);
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

router.get('/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    
    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

router.delete('/subcategories/:id', async (req, res) => {
  const subcategoryId = req.params.id;

  try {
    // Find the subcategory by ID and delete it
    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);

    if (!deletedSubcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.status(204).send(); // 204 No Content response for successful deletion
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
});

router.post("/seller-register", upload.single('image'), async (req, res) => {
  try {
    const {
      shopName,
      yearsInBusiness,
      shopDescription,
      category,
      subcategories, // Array of subcategory IDs
      contactNumber,
      password,
      shopOpenTime,
      shopCloseTime,
      price,
      fullAddress,
    } = req.body;

    // Check if the seller already exists by contactNumber
    const existingSeller = await Seller.findOne({ contactNumber });

    if (existingSeller) {
      return res
        .status(400)
        .json({ message: "Seller with this contact number already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create an array of subcategory references
    const subcategoryRef = { _id: subcategories };


    const newSeller = new Seller({
      shopName,
      yearsInBusiness,
      shopDescription,
      category,
      subcategories: subcategoryRef,
      contactNumber,
      image:  req.file.filename ,
      password: hashedPassword,
      shopOpenTime,
      shopCloseTime,
      price,
      fullAddress,
    });

    // Save the seller
    await newSeller.save();
 console.log(newSeller)
    // Generate a JWT token for the newly registered seller
    const token = jwt.sign({ sellerId: newSeller._id }, secretKey, {
      expiresIn: '1111111h',
    });

    // Return the token along with a success message and seller ID
    res.status(201).json({ message: "Seller registration successful", token, sellerId: newSeller._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during seller registration." });
  }
});

router.post('/seller-login', async (req, res) => {
  try {
    const { contactNumber, password } = req.body;

    // Check if the seller exists by contactNumber
    const existingSeller = await Seller.findOne({ contactNumber });

    if (!existingSeller) {
      return res.status(401).json({ message: 'Seller not found.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, existingSeller.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate a JWT token for the authenticated seller
    const token = jwt.sign({ sellerId: existingSeller._id }, secretKey, {
      expiresIn: '24h', // You can set the token expiration time as needed
    });

    // Return the token along with a success message and seller ID
    res.status(200).json({ message: 'Seller login successful', token, sellerId: existingSeller._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during seller login.' });
  }
});

// Create a GET route to fetch all seller details
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find({}, { password: 0 }); // Exclude the password field
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching seller details:', error);
    res.status(500).json({ error: 'Failed to fetch seller details' });
  }
});


const authenticate = (req, res, next) => {
  // Implement your authentication logic here using secretKey
  // For example, you can use JWT to authenticate the user
  const token = req.headers.authorization; // Assuming you pass the token in the header

  // Check if the token is valid
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token using your secretKey and decode it
  // Implement your JWT verification logic here

  // If authentication fails, return a 401 Unauthorized response

  // If authentication succeeds, you can proceed to the next middleware or route handler
  next();
};



router.get('/category/:categoryId/subcategory/:subcategoryId/sellers', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const subcategoryId = req.params.subcategoryId;

    // Find sellers that belong to the specified category and subcategory
    const sellers = await Seller.find({
      category: categoryId,
      subcategories: subcategoryId,
    });

    if (!sellers || sellers.length === 0) {
      return res.status(404).json({ message: 'No sellers found in this category and subcategory' });
    }

    // Return the list of sellers
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Failed to fetch sellers' });
  }
});
router.delete('/sellers/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    // Check if the seller exists
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Delete the seller
    await Seller.findByIdAndRemove(sellerId);

    res.status(204).json(); // Respond with a success status code
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'An error occurred while deleting the seller' });
  }
});

router.get("/seller/:id", async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Find the seller by ID
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Return the seller details
    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the seller." });
  }
});



router.post('/products/:SellerId', upload.single('image'), async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    location,
    deliveryTime,
    image
  } = req.body;

  const { SellerId } = req.params; // Extract SellerId from URL params

  try {
    // Validate the seller ID (you should have a seller model and schema)
    const existingSeller = await Seller.findById(SellerId);
    if (!existingSeller) {
      return res.status(400).json({ error: 'Invalid seller ID' });
    }

    const product = new Product({
      name: name || '',
      description: description || '',
      price: price || 0,
      Seller: existingSeller._id, 
      category: category || '',
      location: location || '',
      deliveryTime: deliveryTime || '',
      image: req.file.filename, // Assuming the field name for the image is 'image'
    });
  console.log(product)
  console.log(existingSeller)
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});
router.delete('/products/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


router.get('/seller/:id', async (req, res) => {
  try {
    const sellerId = req.params.id;
    // Fetch the seller by ID
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Fetch the seller's products (you may need to customize this part)
    const sellerProducts = await Product.find({ Seller: sellerId });

    // Return the seller details and products
    res.status(200).json({ seller, products: sellerProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the seller.' });
  }
});

router.post('/seller/:sellerId/blogs', async (req, res) => {
  try {
    const { title, content } = req.body;
    const { sellerId } = req.params; // Extract sellerId from URL params

    // Validate sellerId
    // You can use a middleware to verify the seller's identity and extract the sellerId

    // Create a new blog
    const blog = new Blog({
      title,
      content,
      author: sellerId,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

router.get('/products', async (req, res) => {
  try {
    // Fetch all products from your database
    const products = await Product.find();

    // Return the list of products as JSON response
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch the product by its ID from your database
    const product = await Product.findById(productId);

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the product as a JSON response
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.get('/api/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Fetch reviews for the specified product from the database
    const reviews = await Review.find({ productId });// Assuming you have a User model for user details.

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// API endpoint for submitting a new review
router.post('/api/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params; // Get productId from URL params
    const { name,rating, comment } = req.body;
    
    // Create a new review and save it to the database
    const review = new Review({name,productId, rating, comment });
    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});
// Import necessary modules and Seller model
// Import your Seller model

// ... Other route imports and middleware ...

// Route for sending inquiries to a seller
router.post('/seller/:id/inquiries', async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { phoneNumber, question } = req.body;

    // Find the seller by ID
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Update the seller's document to store the inquiry
    seller.inquiries.push({ phoneNumber, question });
    await seller.save();
   console.log(seller)
    // Respond with a success message
    res.status(201).json({ message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error('Error sending inquiry:', error);
    res.status(500).json({ error: 'Failed to send inquiry' });
  }
});

// Route for liking a seller
router.post('/seller/:id/likes', async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Find the seller by ID
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Check if the user (you can use authentication to get the user ID) has already liked the seller
    const userId = req.user.id; // Replace with your authentication logic
    if (seller.likes.includes(userId)) {
      return res.status(400).json({ error: 'You already liked this seller' });
    }

    // Update the seller's document to add the user ID to the likes array
    seller.likes.push(userId);
    await seller.save();

    // Respond with a success message
    res.status(201).json({ message: 'Seller liked successfully' });
  } catch (error) {
    console.error('Error liking seller:', error);
    res.status(500).json({ error: 'Failed to like seller' });
  }
});
// GET all blogs
router.get('/blogs', async (req, res) => {
  try {
    // Retrieve all blogs
    const blogs = await Blog.find();
    
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { link } = req.body;
    const { filename } = req.file;

    // Create a new image document in the database
    const newImage = new Image({
      image: req.file.filename,  // Store the path to the uploaded image
      link,
    });

    // Save the image document to the database
    await newImage.save();

    res.status(201).json({ message: 'Image and link uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/images', async (req, res) => {
  try {
    // Retrieve all image documents from the database
    const images = await Image.find();

    // Map the images to return only necessary data
    const imageList = images.map((image) => ({
      _id: image._id,
      image: image.image,
      link: image.link,
    }));

    res.status(200).json(imageList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;

