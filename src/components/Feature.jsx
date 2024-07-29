import React from "react";

const Feature = () => {
  return (
    <div className="container px-4 pb-5" id="featured-3">
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="feature col">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center fs-2 mb-3">
            <img className="rounded-3" src="/Icon1.jpg" alt="icon1" />
          </div>
          <h3 className="fs-2 text-body-emphasis">Data Analysis</h3>
          <p>In-depth analysis of stock market data using AI.</p>
        </div>
        <div className="feature col">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center fs-2 mb-3">
          <img className="rounded-3" src="/Icon2.jpg" alt="icon2" />
          </div>
          <h3 className="fs-2 text-body-emphasis">Accurate Predictions</h3>
          <p>Reliable stock predictions based on advanced algorithms.</p>
        </div>
        <div className="feature col">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center fs-2 mb-3">
          <img className="rounded-3" src="/Icon3.jpg" alt="icon3" />
          </div>
          <h3 className="fs-2 text-body-emphasis">Real-Time Updates</h3>
          <p>Stay updated with real-time stock market changes.</p>
        </div>
      </div>
    </div>
  );
};

export default Feature;
