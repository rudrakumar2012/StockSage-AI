import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Hero2 from "./components/Hero2";
import Hero3 from "./components/Hero3";
import Feature from "./components/Feature";
import StockGrid from "./components/StockGrid";
import Insights from "./components/Insights";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showdata" element={<StockGrid />} />
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
    </div>
  );
}

export default App;
