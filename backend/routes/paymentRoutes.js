const express = require('express');
const router = express.Router();
const { processPayment, notifyBooking } = require('../controllers/paymentController');

// All payment routes would normally be protected, but for simplicity assuming open or middleware added later
router.post('/process', processPayment);
router.post('/notify', notifyBooking);

module.exports = router;
