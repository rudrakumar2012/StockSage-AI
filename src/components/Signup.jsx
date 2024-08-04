import React from 'react';

const Signup = () => {
  return (
    <div
      className="container px-4 py-5 text-center"
      style={{
        backgroundImage: `url(lummi4.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card mb-4 rounded-3 shadow-sm mx-auto" style={{ maxWidth: "400px", backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="card-body">
          <h1 className="card-title pricing-card-title text-center">Sign up</h1>
          <p>Join Us Now!</p>
          <button className="btn btn-outline-danger btn-rounded btn-lg px-4 mb-3" style={{ width: '100%' }}>
            <i className="bi bi-google"></i> Continue with Google
          </button>
          <div className="text-center my-3 d-flex align-items-center">
            <div className="flex-grow-1">
              <hr className="mx-3" style={{ borderTop: '1px solid #31D2F2' }} />
            </div>
            <span className="mx-2" style={{ color: '#31D2F2' }}>or</span>
            <div className="flex-grow-1">
              <hr className="mx-3" style={{ borderTop: '1px solid #31D2F2' }} />
            </div>
          </div>
          <form>
            <div className="mb-3">
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Email" style={{ borderColor: '#31D2F2', borderWidth: '2px' }} />
            </div>
            <button type="submit" className="btn btn-outline-primary btn-rounded btn-lg px-4" style={{ width: '100%' }}>Continue with Email</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;