import React from "react";
import { Link } from "react-router-dom";

const Insights = () => {
  return (
    <div className="container py-5">
      <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-4">
        Predictive Insights
      </h1>
      <p className="mb-0">Discover market trends and insights.</p>
      <div className="row align-items-center g-5 py-5">
        <div className="col-lg-6">
          <div className="border rounded-2">
            <div className="row align-items-center flex-md-row flex-column">
              <div className="col-md-6 mb-3">
                <h3 className="display-7 text-body-emphasis lh-sm mb-3 px-3">
                  Unlock the Future of Stock Market Predictions
                </h3>
                <p className="mb-4 px-3">Utilize AI for smarter investments.</p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-start px-3">
                  <Link
                    to="/showdata"
                    className="button1 px-4 me-md-2 py-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <div className="col-md-6">
                <img
                  src="/lummi.jpg"
                  className="d-block mx-lg-auto img-fluid rounded-end"
                  alt="Bootstrap Themes"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="border rounded-3">
            <div className="row align-items-center flex-md-row flex-column">
              <div className="col-md-6 mb-3">
                <h3 className="display-7 text-body-emphasis lh-sm mb-3 px-3">
                  Unlock the Future of Stock Market Predictions
                </h3>
                <p className="mb-4 px-3">Utilize AI for smarter investments.</p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-start px-3">
                  <Link
                    to="/showdata"
                    className="button1 px-4 me-md-2 py-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <div className="col-md-6">
                <img
                  src="/lummi2.jpg"
                  className="d-block mx-lg-auto img-fluid rounded-end"
                  alt="Bootstrap Themes"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col" style={{ padding: "0" }}>
            <div className="border rounded-2 w-100">
              <div className="row align-items-center flex-md-row flex-column">
                <div className="col-md-6 mb-3">
                  <h3 className="display-7 text-body-emphasis lh-sm mb-3 px-3">
                    Unlock the Future of Stock Market Predictions
                  </h3>
                  <p className="mb-4 px-3">
                    Utilize AI for smarter investments.
                  </p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-start px-3">
                    <Link
                      to="/showdata"
                      className="button1 px-4 me-md-2 py-1"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    src="/lummi3.jpg"
                    className="d-block mx-lg-auto img-fluid rounded-end"
                    alt="Bootstrap Themes"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
