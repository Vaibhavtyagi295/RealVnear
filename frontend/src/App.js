import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Home from "./home/Home";
import CategoryPage from './category/category';
import SubcategoryPage from './category/subcategory';
import SellersPage from './category/Sellers';
import SecondCategoryPage from "./TopProducts/second";
import Shop from "./category/shop"
import Aboutus from "./Aboutus/Aboutus"
import JoinUs from "./joinus/joinus"

import BookingPage from "./Booking/onlinebooking"// Import your Categories component
import AuthSignup from "./auth/signup"
import Dashboard from './adminpanel/dashboard';
import SellerRegistration from "./auth/sellerAuth"
import Blogs from "./Blog/Blog"
import Sellerinfo from "./category/seller-dashboard"
import ProductDetail from "./category/productdetail"
import CreateCategory from "./adminpanel/CreateCategory"
import CreateSubcategoryPage from "./adminpanel/CreateSubCategory"
import UserLogin from "./auth/UserLogin"
import DisplayCategory from "./adminpanel/Categoryshow"
import SubDisplayCategory from "./adminpanel/SubCategory"
import Users from "./adminpanel/Users"
import SellerAdmin from "./adminpanel/SellerDetailAdmin"
import ProductAdmin from "./adminpanel/ProductAdmin"
import BlogaAdmin from "./adminpanel/Blogsadmin"
import ImageAdder from "./adminpanel/ImageAdd"
import Footer from "./footer/footer"
import Sellerlogin from "./auth/Sellerlogin"
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route
          path="/"
          element={
            <>
              <Home />
              <CategoryPage />
              <SecondCategoryPage />
              <Blogs/>
              <BookingPage />
            </>
          }
        />
        <Route path="/category/:categoryId/subcategories" element={<SubcategoryPage/>} />
        <Route path="/category/:categoryId/subcategory/:subcategoryId/sellers" element={<SellersPage/>} />
        <Route path="/seller/:id" element={<Shop/>} />
        <Route path="/AuthSignup" element={<AuthSignup/>} />
        <Route path="/SellerRegistration" element={<SellerRegistration/>} />
        <Route path="/Seller-dashboard/:sellerId" element={<Sellerinfo/>} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
        <Route path="/UserzLogin" element={<UserLogin />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/JoinUs" element={<JoinUs />} />
        <Route path="/sellerlogin" element={<Sellerlogin />} />
       
      
              

        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CreateCategory" element={<CreateCategory />} />
        <Route path="/CreateSubcategoryPage" element={<CreateSubcategoryPage />} />
        <Route path="/DisplayCategory" element={<DisplayCategory />} />
        <Route path="/SubDisplayCategory" element={<SubDisplayCategory />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/SellerAdmin" element={<SellerAdmin />} />
        <Route path="/ProductAdmin" element={<ProductAdmin />} />
        <Route path="/BlogaAdmin" element={<BlogaAdmin />} />
        <Route path="/ImageAdder" element={<ImageAdder />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
