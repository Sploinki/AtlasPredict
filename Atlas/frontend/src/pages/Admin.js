import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import "./Admin.css";

const AdminLogin = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleLogin = () => {
    console.log("Admin Email:", adminEmail);
    console.log("Admin Password:", adminPassword);
  };

  return (
    <Box className="admin-page">
      <div className="overlay" />
      <motion.div
        className="admin-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" className="admin-heading">
          Admin Portal
        </Typography>

        <TextField
          label="Admin Email"
          variant="outlined"
          fullWidth
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="admin-input"
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          className="admin-input"
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          className="admin-button"
        >
          Sign In
        </Button>
      </motion.div>
    </Box>
  );
};

export default AdminLogin;
