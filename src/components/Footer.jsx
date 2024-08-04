import React from "react";
import { FaFacebook, FaInstagram, FaTimes } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="container">
      <footer className="py-3 my-4">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-muted">
              About Us
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-muted">
              Contact
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-muted">
              Pricing
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-muted">
              FAQs
            </a>
          </li>
          <li className="nav-item">
            <a href="mailto:fJfJt@example.com" className="nav-link px-2 text-muted">
              Support
            </a>
          </li>
        </ul>
        <div className="d-flex justify-content-between align-items-center">
          <p className="text-center text-muted">&copy; 2024 StockSageAI.</p>
          <div>
            <a href="#" className="me-3">
              <FaFacebook size={24} color={"#4267B2"} />
            </a>
            <a href="#" className="me-3">
              <FaInstagram size={24} color={"#E1306C"} />
            </a>
            <a href="#" className="me-3">
              <FaTimes size={24} color={"#000"} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
