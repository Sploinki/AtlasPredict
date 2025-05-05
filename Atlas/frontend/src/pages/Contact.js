import React from "react";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";
import background from "../assets/contact.jpg";

const Contact = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${background}) center/cover no-repeat`,
        p: 2,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        elevation={10}
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={2}>
          We would love to hear from you!
        </Typography>

        <TextField fullWidth label="Your Name" variant="outlined" margin="normal" />
        <TextField fullWidth label="Your Email" variant="outlined" margin="normal" />
        <TextField fullWidth label="Your Message" multiline rows={4} variant="outlined" margin="normal" />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Send Message
        </Button>
      </Paper>
    </Box>
  );
};

export default Contact;
