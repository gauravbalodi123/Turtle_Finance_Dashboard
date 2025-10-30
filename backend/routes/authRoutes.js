const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Client = require('../models/client'); //
const Advisor = require('../models/advisor'); //
const router = express.Router();
const crypto = require('crypto');
const sendEmail = require('../utils/sendOtpEmail');
require('dotenv').config();


const sendTokenResponse = async (user, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
  });

  let status = null;

  if (user.role === 'client') {
    const client = await Client.findOne({ userId: user._id });
    status = client?.subscriptionStatus || "Prospect"; // or set 'pending', etc. as default
  }

  res.json({ success: true, role: user.role, status, name: user.name }); // ✅ send status
};


// GET /auth/check-auth
router.get('/check-auth', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ fetch only the fields you want
    const user = await User.findById(decoded.id).select("name phone email role");

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ return them all
    res.json({
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});





// Local login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) return res.status(400).json({ message: 'Login failed' });
    sendTokenResponse(user, res);
  })(req, res, next);
});





router.post('/register', async (req, res) => {
  try {
    const data = req.body;

    // ✅ Normalize email depending on type (array or string)
    const primaryEmail = Array.isArray(data.email)
      ? data.email[0] // first email if array
      : data.email;   // directly use if string

    // Basic validation
    if (!data.name || !primaryEmail || !data.password || !data.role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const allowedRoles = ['admin', 'client', 'advisor'];
    if (!allowedRoles.includes(data.role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if a user already exists with this primary email
    const existingUser = await User.findOne({ email: primaryEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Create User (always with a single string email)
    const user = await User.create({
      name: data.name,
      email: primaryEmail,
      password: data.password,
      role: data.role,
      phone: data.phone,
    });

    // 🔹 Handle role-based creation
    if (data.role === 'client') {
      if (!data.phone) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ message: 'Phone number is required for clients' });
      }

      try {
        await Client.create({
          userId: user._id,
          fullName: data.name,
          email: primaryEmail, // ✅ single string
          phone: data.phone,
          clientType: data.clientType,
        });
      } catch (clientErr) {
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          message: 'Client creation failed, user rolled back',
          error: clientErr.message,
        });
      }

    } else if (data.role === 'advisor') {
      try {
        // ✅ Normalize advisor email as an array
        const advisorEmails = Array.isArray(data.email)
          ? data.email.filter(Boolean) // remove empty ones
          : [data.email];

        await Advisor.create({
          ...data,
          userId: user._id,
          advisorFullName: data.name,
          email: advisorEmails, // ✅ full list for advisor model
        });
      } catch (advisorErr) {
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          message: 'Advisor creation failed, user rolled back',
          error: advisorErr.message,
        });
      }
    }

    // ✅ Send token
    await sendTokenResponse(user, res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});





// Logout (clear cookie)
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});





router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check if OTP was requested in the last 2 mins
    if (user.otpRequestedAt && Date.now() - user.otpRequestedAt < 2 * 60 * 1000) {
      const remainingTime = 120 - Math.floor((Date.now() - user.otpRequestedAt) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingTime} seconds before requesting a new OTP.`,
        retryAfter: remainingTime
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 mins
    user.otpRequestedAt = Date.now();
    await user.save();

    // send OTP via nodemailer (your logic here)
    await sendEmail({
      to: user.email,
      subject: 'Your Turtle Finance OTP for Password Reset',
      html: `
      <p>Dear ${user.name || 'User'},</p>

      <p>We received a request to reset the password for your Turtle Finance account.</p>

      <p><strong>Your One-Time Password (OTP) is:</strong></p>
      <h2 style="color:#2e6c80;">${otp}</h2>

      <p>This OTP is valid for <strong>15 minutes</strong>. Please do not share this code with anyone. Turtle Finance will never ask you for your OTP via email, phone, or chat.</p>

      <p>If you did not request this password reset, please ignore this email or contact our support immediately.</p>

      <p>Thank you,<br/>
      Team Turtle Finance</p>

      <hr/>
      <p style="font-size:12px;color:#888;">This is an automated message. Please do not reply to this email.</p>
      `
    });


    res.json({ success: true, message: 'OTP sent successfully', retryAfter: 120 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
});




router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  try {
    const user = await User.findOne({
      email,
      resetPasswordOTP: hashedOTP,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // ✅ Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    user.otpRequestedAt = undefined;
    await user.save();

    // ✅ Generate short-lived token (10 mins)
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '10m'
    });

    res.json({
      success: true,
      message: 'OTP verified. Proceed to reset password.',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});



router.post('/reset-password', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect: Bearer <token>
  const { newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    // ✅ Set new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});






module.exports = {
  authRoutes: router
}
