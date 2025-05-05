import React from "react";
import { Container, Typography, Box, Card } from "@mui/material";
import floodImage from "../assets/dataImage.jpg";
import "./Data.css";

const Data = () => {
  return (
    <Container className="data-section">
      {/* Section Title */}
      <Box className="header-box">
        <Typography variant="h3" className="title">
          Data Sources
        </Typography>
      </Box>

      {/* Data Source Cards */}
      <Box className="data-cards">
        {[
          "Pakistan Meteorological Department",
          "NDMA - National Disaster Management",
          "NASA Earth Observatory",
          "Local Weather Stations",
        ].map((source, index) => (
          <Card
            key={index}
            className="data-card"
            sx={{
              backgroundColor: "transparent !important",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white !important",
              padding: "20px",
            }}
          >
            <Typography variant="body1" className="card-text">
              {source}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Flood Image */}
      <Box className="image-container">
        <img src={floodImage} alt="Flood Map" className="flood-image" />
      </Box>
    </Container>
  );
};

export default Data;
