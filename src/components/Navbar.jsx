import React from "react";
import { HashLink } from 'react-router-hash-link';

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary rounded fixed-top"
      aria-label="Thirteenth navbar example"
    >
      <div className="container-fluid">
        <HashLink className="navbar-brand d-lg-none" smooth to="/#">
          StockSage AI
        </HashLink>
        <button
          className="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample11"
          aria-controls="navbarsExample11"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="navbar-collapse d-lg-flex collapse"
          id="navbarsExample11"
        >
          <HashLink className="navbar-brand d-none d-lg-block" smooth to="/#">
            StockSage AI
          </HashLink>
          <ul className="navbar-nav col-lg-6 justify-content-lg-center">
            <li className="nav-item">
              <HashLink className="nav-link active" aria-current="page" smooth to="/#">
                Home
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink className="nav-link active" aria-current="page" smooth to="/#featured-3">
                Features
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink className="nav-link active" aria-current="page" smooth to="/#pricing">
                Pricing
              </HashLink>
            </li>
          </ul>
          <div className="d-lg-flex col-lg-3 justify-content-lg-end">
            <button
              className="button1 px-3 me-md-2"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;