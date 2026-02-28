const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BookingOTP = require('../models/BookingOTP');
const { sendEmailOTP, sendPhoneOTP } = require('../utils/otpService');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    console.log("REGISTER PAYLOAD:", req.body); // DEBUG

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const emailFormatted = email.toLowerCase().trim();
    const existing = await User.findOne({ email: emailFormatted });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate Verification OTPs (Required for App)
    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);


    const user = await User.create({
      name,
      email: emailFormatted,
      phone,
      password,
      role: 'user',
      isAdmin: false,
      emailOTP,
      phoneOTP,
      otpExpiry
    });

    // Send OTPs
    await sendEmailOTP(user.email, emailOTP);
    await sendPhoneOTP(phone, phoneOTP);

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ error: 'Email already verified' });
    if (user.emailOTP !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

const verifyPhone = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isPhoneVerified) return res.status(400).json({ error: 'Phone already verified' });
    if (user.phoneOTP !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isPhoneVerified = true;
    user.phoneOTP = undefined;
    await user.save();

    res.status(200).json({ message: 'Phone verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        lastLogin: user.lastLogin
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    console.log(`BACKEND: Resend OTP requested for User ID: ${req.user.id}, New Email: ${email}, New Phone: ${phone}`);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update email/phone if provided
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Generate new 6-digit OTPs
    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.emailOTP = emailOTP;
    user.phoneOTP = phoneOTP;
    user.otpExpiry = otpExpiry;
    user.isEmailVerified = false;
    user.isPhoneVerified = false;
    await user.save();

    // Send OTPs
    await sendEmailOTP(user.email, emailOTP);
    await sendPhoneOTP(user.phone, phoneOTP);

    res.status(200).json({
      message: 'OTPs sent successfully',
      user: {
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (err) {
    console.error('Resend OTP error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to send OTPs' });
  }
};

// POST /api/auth/send-booking-otp
const sendBookingOTP = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (!email || !phoneNumber) {
      return res.status(400).json({ error: 'Email and Phone Number are required' });
    }

    // Phone Validation
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number. Must be 10 digits.' });
    }

    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Save/Update temporary OTP record
    await BookingOTP.findOneAndUpdate(
      { email, phoneNumber },
      { emailOTP, phoneOTP, expiry, isVerified: false },
      { upsert: true, new: true }
    );

    // Send OTPs (These handles their own dev fallbacks now)
    await sendEmailOTP(email, emailOTP);
    await sendPhoneOTP(phoneNumber, phoneOTP);

    res.status(200).json({
      message: 'OTPs sent successfully',
      devMode: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
    });
  } catch (err) {
    console.error('Send Booking OTP Error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to send OTPs' });
  }
};

// POST /api/auth/verify-booking-otp
const verifyBookingOTP = async (req, res) => {
  try {
    const { email, phoneNumber, emailOTP, phoneOTP } = req.body;
    if (!email || !phoneNumber || !emailOTP || !phoneOTP) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const otpRecord = await BookingOTP.findOne({ email, phoneNumber });
    if (!otpRecord) {
      return res.status(404).json({ error: 'OTP record not found' });
    }

    if (new Date() > otpRecord.expiry) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpRecord.emailOTP !== emailOTP || otpRecord.phoneOTP !== phoneOTP) {
      return res.status(400).json({ error: 'Invalid OTPs' });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({ message: 'Verification successful', isVerified: true });
  } catch (err) {
    console.error('Verify Booking OTP Error:', err.message);
    res.status(500).json({ error: 'Failed to verify OTPs' });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  verifyPhone,
  resendOTP,
  sendBookingOTP,
  verifyBookingOTP
};
