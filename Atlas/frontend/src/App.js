import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Data from "./pages/Data";
import Features from "./pages/Features";  
import Predictions from "./pages/Predictions";   
import Admin from "./pages/Admin"; 
import Alerts from "./pages/Alerts";  // ✅ Import Alerts Page
import Omar from "./pages/Atlas";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<Omar />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/data" element={<Data />} />
        <Route path="/features" element={<Features />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/alerts" element={<Alerts />} />  {/* ✅ Added Alerts Route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
