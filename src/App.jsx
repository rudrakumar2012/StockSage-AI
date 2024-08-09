import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Hero2 from "./components/Hero2";
import Hero3 from "./components/Hero3";
import Feature from "./components/Feature";
import Dashboard from "./components/Dashboard";
import Insights from "./components/Insights";
import Pricing from "./components/Pricing";
import Signup from "./components/Signup";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showdata" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <Hero />
      <Hero2 />
      <Hero3 />
      <Feature />
      <Insights />
      <Pricing />
      <Signup />
      <br />
      <Footer />
    </div>
  );
}

export default App;
