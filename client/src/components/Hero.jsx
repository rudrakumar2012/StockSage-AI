import React from "react";

const Hero = () => {
  return (
    <div className="px-4 pt-5 my-5 text-center border-bottom">
      <div className="container">
        <div className="overflow-hidden" style={{ maxHeight: "80vh" }}>
          <div className="container px-5">
            <img
              src="/Image-Container.jpg"
              className="img-fluid border rounded-3 shadow-lg mb-4"
              alt="Example image"
              loading="lazy"
            />
          </div>
        </div>
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
              <button className="btn btn-primary">Learn more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
