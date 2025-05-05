import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button, MenuItem, Select } from "@mui/material";
import { motion } from "framer-motion";

import floodbg from "../assets/floodbg.jpg";
import pred from "../assets/pred.jpg";
import flood3 from "../assets/flood3.jpg";

import "./Predictions.css";

const imageList = [floodbg, pred, flood3];

const Predictions = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState("");

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="predictions-page">
      {/* Image Slider */}
      <Box className="image-slider">
        <Button onClick={prevImage} className="nav-button left">&lt;</Button>

        <motion.img
          key={currentImage}
          src={imageList[currentImage]}
          alt="Flood"
          className="carousel-image"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
        />

        <Button onClick={nextImage} className="nav-button right">&gt;</Button>
      </Box>

      {/* Prediction Content */}
      <Container maxWidth="md" className="content-box">
        <Typography variant="h3" className="title">
          FLOOD PREDICTIONS
        </Typography>
        <Typography variant="body1" className="subtitle">
          Get real-time flood risk predictions based on data and AI analysis. Enter your province to analyze potential flood risks.
        </Typography>

        <Select
          variant="outlined"
          className="input-field"
          fullWidth
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Province</MenuItem>
          <MenuItem value="Punjab">Punjab</MenuItem>
          <MenuItem value="Sindh">Sindh</MenuItem>
          <MenuItem value="KPK">KPK</MenuItem>
          <MenuItem value="Balochistan">Balochistan</MenuItem>
          <MenuItem value="Gilgit-Baltistan">Gilgit-Baltistan</MenuItem>
        </Select>

        <Box textAlign="center" marginTop={2}>
          <Button variant="contained" color="primary" className="run-button">
            RUN MODEL
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Predictions;
