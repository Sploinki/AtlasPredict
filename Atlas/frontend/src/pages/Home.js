import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

// Image array for sliding effect
const images = [
  { src: require("../assets/admin.png"), text: "" },
  { src: require("../assets/flood.jpeg"), text: "AI-powered Flood Forecasting" },
  { src: require("../assets/landslide.jpg"), text: "Landslide Risk Analysis" },
  { src: require("../assets/storm.jpg"), text: "Storm and Cyclone Alerts" }
];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="home-container"
    >
      {/* Hero Section */}
      <Box className="hero">
        <AnimatePresence>
          <motion.img
            key={images[index].src}
            src={images[index].src}
            alt="Disaster Image"
            className="hero-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        <Box className="hero-overlay">
          <Container maxWidth="md" className="hero-content">
            <motion.div
              className="text-container"
              whileHover={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {images[index].text && (
                <>
                  <Typography
                    variant="h2"
                    className="hero-title"
                    align="center"
                  >
                    {images[index].text}
                  </Typography>
                  <Typography
                    variant="h5"
                    className="hero-subtext"
                    align="center"
                  >
                    AI-driven disaster response & prediction.
                  </Typography>
                </>
              )}
            </motion.div>
          </Container>
        </Box>
      </Box>

      {/* About Section */}
      <Box className="about-section" py={6}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {/* Left Side - About the Project */}
            <Grid item xs={12} md={6}>
              <Paper className="about-box" elevation={3} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h4" className="about-title" gutterBottom>
                  About the Project
                </Typography>
                <Typography variant="body1" className="about-text" align="justify">
                  Our Natural Disaster Prediction System is designed to provide real-time flood and heavy rainfall forecasts in Pakistan. Utilizing data from NDMA, and NASA, it employs advanced machine learning algorithms like Random Forest, SVM, and LSTM to deliver precise, location-based disaster predictions.
                </Typography>
              </Paper>
            </Grid>

            {/* Right Side - Moto & Team */}
            <Grid item xs={12} md={6}>
              <Paper className="about-box" elevation={3} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h4" className="about-title" gutterBottom>
                  Our FYP Moto
                </Typography>
                <Typography variant="body1" className="about-text" align="center" gutterBottom>
                  "Predict, Prepare, Protect".
                </Typography>
                <Typography variant="body1" className="about-text" align="justify" gutterBottom>
                  Our mission is to harness technology to minimize the impact of natural disasters. Through real-time tracking, predictive analytics, and automated safety advisories, we aim to empower authorities and the public with timely information for effective disaster management.
                </Typography>
                <Typography variant="h5" className="team-title" align="center" gutterBottom>
                  Developed By:
                </Typography>
                <Typography variant="body1" className="team-names" align="center">
                  Umar Gul, Omar Mughal, Zainab Kayani
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </motion.div>
  );
};

export default Home;
