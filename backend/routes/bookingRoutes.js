const express = require('express');
const { createBooking, getUserBookings, getAllBookings, deleteBooking, cancelBooking, getBookingHistory } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// POST /api/bookings - Create booking
router.post('/', createBooking);

// GET /api/bookings/user/:userId - Get bookings for a user (auth required)
router.get('/user/:userId', authMiddleware, getUserBookings);

// GET /api/bookings/history - Get all booking history
router.get('/history', getBookingHistory);

// PUT /api/bookings/cancel/:id - Cancel a booking
router.put('/cancel/:id', cancelBooking);

// DELETE /api/bookings/:id - Delete a booking (auth required)
router.delete('/:id', authMiddleware, deleteBooking);

// GET /api/bookings - Get all bookings (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllBookings);

module.exports = router;
