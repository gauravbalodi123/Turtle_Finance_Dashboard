import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import turtleLogo from '../assets/images/logo_png.png';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPassword = ({ email, onBack }) => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    try {
      const res = await axios.post(`${url}/auth/verify-otp`, {
        email,
        otp: otp.join(''),
      });
      setToken(res.data.token);
      setVerified(true);
      setMessage('OTP verified. Please enter new password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await axios.post(
        `${url}/auth/reset-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Password reset successful. Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light px-3 ">
      <div className=" col-12 col-md-4 d-flex flex-column bg-white border border-4 border-success rounded-4 shadow  px-5 py-4 border border-2 border-teal ">
        <img src={turtleLogo} alt="Turtle Logo" className="mb-2 align-self-center" style={{ maxWidth: '200px', maxHeight: "50px" }} />

        <h4 className="text-center fw-bold ">Reset Password</h4>
        <p className="text-center text-muted mb-3">
          Enter the OTP sent to <strong>{email}</strong> and set your new password
        </p>

        {message && <div className="alert py-2 alert-success">{message}</div>}
        {error && <div className="alert py-2 alert-danger">{error}</div>}

        <div className="d-flex justify-content-center gap-2 mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="form-control text-center fw-bold fs-5"
              style={{ width: '45px', height: '45px' }}
              value={value}
              onChange={(e) => handleOtpChange(e.target, index)}
              disabled={verified}
            />
          ))}
        </div>

        {!verified && (
          <button
            className="btn btn-outline-turtle-secondary w-100 mb-4"
            onClick={handleVerifyOTP}
          >
            Verify OTP
          </button>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <div className="position-relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={!verified}
              />
              <span
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                role="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!verified}
              />
              <span
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                role="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-lg btn-turtle-primary2 w-100"
            disabled={!verified}
          >
            Reset Password
          </button>
        </form>


        {/* <button
          type="button"
          onClick={onBack}
          className="btn btn-link text-decoration-none text-dark  fw-semibold"
        >
          <IoIosArrowRoundBack className="me-1 fs-4" />
          Back to Email Verification
        </button> */}

        <div className="text-center mt-3">
          <Link onClick={onBack} className="text-decoration-none fw-semibold text-dark">
            <IoIosArrowRoundBack className='fs-4 me-1' />
            Back To Email Verification
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
