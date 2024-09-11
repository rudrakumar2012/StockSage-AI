import React from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="container px-4 py-5 text-center" id="pricing">
      <div className="pricing-header p-3 pb-md-4 mx-auto">
        <h1 className="display-4 fw-normal text-body-emphasis text-center">
          One Plan, All Features
        </h1>
        <p className="fs-5 text-body-secondary">
          Our subscription offers the best tools for stock market predictions.
        </p>
      </div>
      <div
        className="card mb-4 rounded-3 shadow-sm mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-around">
          <div className="w-100 w-md-50">
            <h1 className="card-title pricing-card-title text-center">
              $6.99<small className="text-body-secondary fw-light">/mo</small>
            </h1>
            <p className="fs-6 text-body-secondary">Start predicting today.</p>
          </div>
          <div className="w-100 w-md-50">
            <ul className="list-unstyled mt-3 mb-4">
              <li className="d-flex align-items-center">
                <span className="me-2">✔️</span>Nifty 50
              </li>
              <li className="d-flex align-items-center">
                <span className="me-2">✔️</span>Nifty Next 50
              </li>
              <li className="d-flex align-items-center">
                <span className="me-2">✔️</span>Small Cap 50 and Mid Cap 50
              </li>
              <li className="d-flex align-items-center">
                <span className="me-2">✔️</span>Help and email support
              </li>
            </ul>
          </div>
        </div>
        <div className="d-grid gap-2 mx-auto mb-3">
          <Link
            to="/showdata"
            className="buttoninfo px-4"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
