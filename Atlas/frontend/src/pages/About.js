import React from "react";
import { motion } from "framer-motion";
import "./About.css";
import backgroundImage from "../assets/about.jpg";

const About = () => {
  return (
    <div
      className="about-container"
      style={{
        background: `url(${backgroundImage}) no-repeat center center/cover`,
      }}
    >
      <motion.div
        className="about-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="about-title">About AtlasPredict</h1>
        <p className="about-subtitle">
          Your trusted partner for natural disaster prediction.
        </p>

        <h2 className="section-heading">🌐 Our Mission</h2>
        <p className="section-text">
          We are committed to leveraging technology and AI to provide timely and accurate predictions of natural disasters.
        </p>
        <div className="section-divider"></div>

        <h2 className="section-heading">📡 What We Do</h2>
        <p className="section-text">
          We integrate geospatial data from NASA, NDMA, and SUPARCO to offer real-time insights on floods and landslides.
        </p>
        <div className="section-divider"></div>

        <h2 className="section-heading">👥 The Team</h2>
        <p className="section-text">
          Our team consists of experts in AI, data science, and environmental studies, working together to develop innovative solutions.
        </p>
        <div className="section-divider"></div>

        <h2 className="section-heading">📞 Contact Us</h2>
        <p className="section-text">
          For inquiries, visit our <a href="/contact" className="contact-link">Contact</a> page.
        </p>

      </motion.div>
    </div>
  );
};

export default About;
