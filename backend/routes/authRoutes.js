const express = require('express');
const { register, login, verifyEmail, verifyPhone, resendOTP, sendBookingOTP, verifyBookingOTP } = require('../controllers/authController');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/verify-email
router.post('/verify-email', verifyEmail);

// POST /api/auth/verify-phone
router.post('/verify-phone', verifyPhone);

// POST /api/auth/resend-otp
router.post('/resend-otp', auth, resendOTP);

// NEW: Manual Booking OTP Routes
router.post('/send-booking-otp', sendBookingOTP);
router.post('/verify-booking-otp', verifyBookingOTP);

// NEW: Simplified OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
