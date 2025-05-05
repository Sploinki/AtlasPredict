import React from "react";
import { Typography, Box, Container, Paper, Link } from "@mui/material";
import { motion } from "framer-motion";
import BackgroundImage from "../assets/contact.jpg";

const features = [
  {
    title: "Real-Time Predictions",
    description: "Get accurate predictions about natural disasters like floods and heavy rainfall based on real-time data analysis.",
  },
  {
    title: "Dynamic Weather Tracking",
    description: "Monitor weather changes dynamically to stay ahead of natural disasters with live updates through AtlasPredict.",
  },
  {
    title: "Localized Alerts",
    description: "Receive tailored alerts for your specific region, ensuring you're always informed and prepared.",
  },
  {
    title: "Interactive Mapping",
    description: "Explore an interactive atlas that visualizes disaster risks and weather patterns across Pakistan.",
  },
  {
    title: "User-Friendly Interface",
    description: "Experience a simple and intuitive interface designed for ease of use and quick access to information.",
  },
  {
    title: "Data-Driven Insights",
    description: "Gain valuable insights through comprehensive analytics, helping authorities and users make informed decisions in disaster scenarios.",
  },
];

const Features = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `url(${BackgroundImage}) no-repeat center center/cover`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 2 }}>
            Key Features of AtlasPredict
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#cccccc",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: "1.1rem",
            }}
          >
            Discover the powerful features that make AtlasPredict your go-to solution for disaster predictions.
          </Typography>
        </motion.div>

        {/* Features Grid */}
        <Box
          sx={{
            mt: 5,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 4,
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Paper
                elevation={4}
                sx={{
                  height: "100%",
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, px: 1 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 6, textAlign: "center", color: "#cccccc", fontSize: "0.95rem" }}>
          <Typography>
            For more information, visit the{" "}
            <Link
              href="https://www.pmd.gov.pk"
              target="_blank"
              sx={{ color: "#cccccc", fontWeight: "bold" }}
              underline="hover"
            >
              Pakistan Meteorological Department
            </Link>
            .
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
