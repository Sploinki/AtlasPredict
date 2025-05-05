import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="toolbar">
        {/* App Name Styled Separately */}
        <Box component={Link} to="/predict" className="logo-container-link">
          <Box className="logo-container">
            <img src="/Logoo.png" alt="Logo" className="logo" />
            <Typography variant="h6" className="app-name">Atlas Predict</Typography>
          </Box>
        </Box>



        {/* Navigation Links */}
        <Box className="nav-links">
          <Button component={Link} to="/" className="nav-button">Home</Button>
          <Button component={Link} to="/predict"className="nav-button">Atlas</Button>
          <Button component={Link} to="/alerts" className="nav-button alert-btn">Alerts</Button> {/* Added Alerts */}
          <Button component={Link} to="/data" className="nav-button">Sources</Button>
          <Button component={Link} to="/predictions" className="nav-button">Predictions</Button>
          <Button component={Link} to="/features" className="nav-button">Features</Button>
          <Button component={Link} to="/about" className="nav-button">About</Button>
          {/* <Button component={Link} to="/admin" className="nav-button">Admin</Button> */}
          <Button component={Link} to="/contact" className="nav-button">Contact Us</Button>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
