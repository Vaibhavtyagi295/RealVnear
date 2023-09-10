import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import SubCategoryIcon from '@mui/icons-material/List';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Drawer variant="persistent" anchor="left" open={isSidebarOpen}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/CreateCategory">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Create Category" />
          </ListItem>
          <ListItem button component={Link} to="/CreateSubcategoryPage">
            <ListItemIcon>
              <SubCategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Create Subcategory" />
          </ListItem>
          <ListItem button component={Link} to="/DisplayCategory">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Display Category" />
          </ListItem>
          <ListItem button component={Link} to="/SubDisplayCategory">
            <ListItemIcon>
              <SubCategoryIcon />
            </ListItemIcon>
            <ListItemText primary=" Display SubCategory" />
          </ListItem>
          <ListItem button component={Link} to="/Users">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} to="/SellerAdmin">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Seller Admin" />
          </ListItem>
          <ListItem button component={Link} to="/ProductAdmin">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Product Admin" />
          </ListItem>
          <ListItem button component={Link} to="/BlogaAdmin">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Blog Admin" />
          </ListItem>
          <ListItem button component={Link} to="/ImageAdder">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="ImageAdder" />
          </ListItem>
          {/* Add more menu items as needed */}
        </List>
      </Drawer>
      <IconButton onClick={toggleSidebar} style={{ position: 'absolute', left: isSidebarOpen ? '250px' : '0', transition: 'left 0.3s' }}>
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {/* Your page content goes here */}
      </main>
    </div>
  );
};

export default Sidebar;
