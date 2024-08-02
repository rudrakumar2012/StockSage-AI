import React from "react";

const Hero = () => {
  return (
    <div className="px-4 pb-5 mb-5 text-center">
      <div className="overflow-hidden mb-4" style={{ maxHeight: "100vh" }}>
        <div className="container mt-5">
          <img
            src="/Image-Container.jpg"
            className="img-fluid border rounded-5 shadow-lg w-100 h-100"
            alt="Example image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex align-items-center">
            <div className="text-start">
              <h1 className="display-4 fw-bold text-body-emphasis">
                Leveraging Advanced Machine Learning for Accurate Stock Market
                Predictions
              </h1>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="text-start">
              <p className="lead mb-4">
                Using cutting-edge algorithms, we provide accurate and reliable
                predictions for NSE stocks. Join us and stay ahead.
              </p>
              <a
                className="btn btn-outline-info btn-rounded"
                data-mdb-ripple-init
                data-mdb-ripple-color="dark"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
