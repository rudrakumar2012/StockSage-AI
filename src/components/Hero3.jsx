import React from "react";
import { Link } from "react-router-dom";

const Hero3 = () => {
  return (
    <div className="container col-xxl-8 px-4 pt-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
            How It Works
          </h1>
          <p className="lead">
            Seamless integration and user-friendly interface.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <Link
              to="/showdata"
              className="btn btn-outline-info btn-rounded btn-lg px-4 me-md-2"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="col-10 col-sm-8 col-lg-6">
          <img
            src="/Image--lummi.jpg"
            className="d-block mx-lg-auto rounded-5 img-fluid"
            alt="Bootstrap Themes"
            width="700"
            height="500"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero3;
