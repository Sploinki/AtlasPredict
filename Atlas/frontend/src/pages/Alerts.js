import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import "./Alerts.css";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [randomRiskMode, setRandomRiskMode] = useState(false);
  const [randomRiskData, setRandomRiskData] = useState({});
  const [riskData, setRiskData] = useState([]);

  // Retrieve state from localStorage on mount
  useEffect(() => {
    const savedRandomRiskMode = JSON.parse(localStorage.getItem("randomRiskMode"));
    const savedRandomRiskData = JSON.parse(localStorage.getItem("randomRiskData"));

    if (savedRandomRiskMode !== null) setRandomRiskMode(savedRandomRiskMode);
    if (savedRandomRiskData !== null) setRandomRiskData(savedRandomRiskData);
  }, []);

  // Fetch risk data from the backend
  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/risk-data");
        setRiskData(response.data);
      } catch (error) {
        console.error("Error fetching risk data:", error);
      }
    };

    fetchRiskData();
  }, []);

  // Update alerts based on risk mode
  useEffect(() => {
    console.log("Random Risk Mode:", randomRiskMode);
    console.log("Random Risk Data:", randomRiskData);

    if (randomRiskMode) {
      const filteredAlerts = Object.entries(randomRiskData)
        .filter(([region, risk]) => risk === "Medium Risk" || risk === "High Risk")
        .map(([region, risk]) => ({
          type: risk === "High Risk" ? "warning" : "info",
          title: `${risk} Alert`,
          message: `${region} is currently under ${risk}.`,
        }));

      console.log("Filtered Alerts:", filteredAlerts);
      setAlerts(filteredAlerts.length > 0 ? filteredAlerts : getDefaultAlerts());
    } else {
      const filteredAlerts = riskData
        .filter((region) => region.risk === "Medium Risk" || region.risk === "High Risk")
        .map((region) => ({
          type: region.risk === "High Risk" ? "warning" : "info",
          title: `${region.risk} Alert`,
          message: `${region.name} is currently under ${region.risk}.`,
        }));

      console.log("Backend Filtered Alerts:", filteredAlerts);
      setAlerts(filteredAlerts.length > 0 ? filteredAlerts : getDefaultAlerts());
    }
  }, [randomRiskMode, randomRiskData, riskData]);

  // Default alerts to show when no medium/high risk regions are found
  const getDefaultAlerts = () => [
    { type: "info", title: "Flood Warning", message: "Heavy rainfall expected in Punjab." },
    { type: "warning", title: "Severe Alert", message: "Sindh region might experience flash floods." },
    { type: "info", title: "Precaution", message: "Stay updated with local weather reports." },
  ];

  const closeAlert = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  return (
    <Container className="alert-container">
      <Box className="header-box">
        <Typography variant="h3" className="alert-header">
          Weather Alerts
        </Typography>
        <Typography variant="body1" className="subtitle">
          Stay informed about heavy rain predictions and weather warnings.
        </Typography>
      </Box>

      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            className={`alert ${alert.type === "warning" ? "alert-warning" : "alert-info"}`}
            elevation={3}
          >
            <Box className="alert-content">
              <Typography variant="h5" className="alert-title">
                {alert.title}
              </Typography>
              <Typography variant="body1" className="alert-message">
                {alert.message}
              </Typography>
            </Box>
            <Button className="close-btn" onClick={() => closeAlert(index)}>
              &times;
            </Button>
          </Paper>
        </motion.div>
      ))}
    </Container>
  );
};

export default Alerts;