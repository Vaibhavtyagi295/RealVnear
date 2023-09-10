import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaHome, FaCog, FaImage, FaEnvelope } from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi'; // Or choose icons from react-bootstrap-icons
import { useNavigate } from 'react-router-dom'; // Import useHistory for redirection

function NavbarComponent() {
  // Retrieve the user's role and token from localStorage
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString || '{}'); // Default to an empty object if userDataString is null
  const { token, role } = userData;
  const sellerToken = localStorage.getItem('seller');
  const sellerData = JSON.parse(sellerToken || '{}'); 
  const history = useNavigate(); // Initialize history for redirection

  const handleLogout = () => {
    // Clear the token and role from localStorage (and any other necessary cleanup)
    localStorage.removeItem('userData');
   
    // Redirect to the home page or the desired route
    history('/');
  };
  const handleLoghit = () => {
    // Clear the token and role from localStorage (and any other necessary cleanup)

    localStorage.removeItem('seller');
    // Redirect to the home page or the desired route
    history('/');
  };

  return (
    <Navbar expand="lg" bg="#052C52" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <span className="d-none d-md-inline-block">
            <span className="mr-2">Vnear.in</span>
          </span>
          <span className="d-md-none text-center">
            VNEAR.IN
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <BiMenu />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/">
               Home
            </Nav.Link>

            {sellerToken && (
              <React.Fragment>
                <Nav.Link href={`/Seller-dashboard/${sellerData.sellerId}`}>
  Seller Dashboard
</Nav.Link>

                <Button variant="outline-light" onClick={handleLoghit}>
                  Logout
                </Button>
              </React.Fragment>
            )}
            {/* Conditionally render the Dashboard and Logout buttons */}
            {token && (
              <React.Fragment>
                <Nav.Link href="/Dashboard">
                  Dashboard
                </Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </React.Fragment>
            )}

            {/* Add Login, Signup, Become a Seller, and Seller Login */}
            {!token && (
              <React.Fragment>
                <Nav.Link href="/UserzLogin">Login</Nav.Link>
                <Nav.Link href="/AuthSignup">Signup</Nav.Link>
                <Nav.Link href="/SellerRegistration">Become a Seller</Nav.Link>
                <Nav.Link href="/sellerlogin">Seller Login</Nav.Link>
              </React.Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style>
        {`
          .navbar {
            background-color: #052C52;
          }

          .navbar-brand {
            font-family: 'Your-Font-Family', sans-serif; /* Replace with your desired font */
          }

          .navbar-brand span {
            font-size: 18px; /* Increase the font size as desired */
            padding: 5px 0; /* Add padding as desired */
          }
        `}
      </style>
    </Navbar>
  );
}

export default NavbarComponent;
