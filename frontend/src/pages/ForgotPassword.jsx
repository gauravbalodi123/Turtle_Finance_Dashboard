import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import turtleLogo from '../assets/images/logo_png.png';
import { IoIosArrowRoundBack } from "react-icons/io";
import ResetPassword from './ResetPassword';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const url = import.meta.env.VITE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${url}/auth/send-otp`, { email });
      setMessage(res.data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ⬇ Entire layout is conditionally rendered
  if (otpSent) {
    return (
      <ResetPassword email={email} onBack={() => setOtpSent(false)} />
    );
  }

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center px-3">
      <div className="col-12 col-md-4 d-flex flex-column border border-4 border-success rounded-4 p-5 shadow bg-white">
        <img src={turtleLogo} alt="Turtle Logo" className="mb-4 align-self-center" style={{ maxWidth: '200px', maxHeight: "50px" }} />
        <h2 className="text-center fw-bold fs-4">Forgot Password?</h2>
        <p className="text-center text-muted">
          Enter your email address and we'll send you an OTP to reset your password
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form className='mb-3' onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control form-control-lg my-4"
            placeholder="Enter your email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-lg btn-turtle-primary2 w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none fw-semibold text-dark">
            <IoIosArrowRoundBack className='fs-4 me-1' />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
