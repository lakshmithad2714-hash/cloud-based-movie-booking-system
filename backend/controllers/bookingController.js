const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const User = require('../models/User');
const mongoose = require('mongoose');
const { sendBookingEmail, sendBookingSMS } = require('../utils/notification');

// POST /api/bookings - Create booking
const createBooking = async (req, res) => {
  try {
    const {
      movieId,
      showTime,
      seats,
      paymentMethod,
      totalAmount,
      seatTotal,
      refreshmentTotal,
      grandTotal,
      refreshments,
      movieTitle,
      moviePoster,
      movieLanguage,
      email,
      phoneNumber
    } = req.body;

    if (!movieId || !showTime || !seats || seats.length === 0 || !email || !phoneNumber) {
      return res.status(400).json({ error: 'All booking fields are required' });
    }

    const booking = new Booking({
      user: req.user ? req.user.id : null,
      movieId,
      showTime,
      movieTitle,
      moviePoster,
      movieLanguage,
      seats,
      totalPrice: grandTotal || totalAmount,
      seatTotal: seatTotal || (seats.length * 200),
      refreshmentTotal: refreshmentTotal || 0,
      grandTotal: grandTotal || totalAmount,
      paymentMethod,
      refreshments: refreshments || [],
      email,
      phone: phoneNumber || req.body.phone,
      phoneNumber: phoneNumber || req.body.phone
    });

    await booking.save();

    // Send notifications to manual contact details
    const bookingDetails = {
      bookingId: booking.bookingId || booking._id,
      movieName: movieTitle,
      seats: seats.join(', '),
      date: new Date().toLocaleDateString(),
      showTime: showTime,
      totalPrice: grandTotal || totalAmount,
      seatTotal: seatTotal,
      refreshmentTotal: refreshmentTotal
    };

    await sendBookingEmail(email, bookingDetails);
    await sendBookingSMS(phoneNumber, bookingDetails);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error('BACKEND: CREATE BOOKING ERROR:', err);
    res.status(500).json({ error: err.message || 'Failed to create booking' });
  }
};

// GET /api/bookings/user/:userId - Get bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Get user bookings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// GET /api/bookings - Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email');

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Get all bookings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// DELETE /api/bookings/:id - Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Security: Only the user who made the booking can delete it
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Delete booking error:', err.message);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

// GET /api/bookings/history - Get all booking history
const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

// PUT /api/bookings/cancel/:id - Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    const currentTime = new Date();
    const showTime = new Date(booking.showTime);

    if (currentTime > showTime && !isNaN(showTime.getTime())) {
      booking.status = "Cancelled";
      booking.refundAmount = 0;
      await booking.save();

      return res.json({
        message: "Cancelled after show time. No refund.",
        refund: 0
      });
    }

    // Using grandTotal from the model
    const refund = (booking.grandTotal || booking.totalPrice || 0) * 0.8;

    booking.status = "Cancelled";
    booking.refundAmount = refund;

    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      refund
    });

  } catch (error) {
    console.error("Cancel Error:", error);
    res.status(500).json({ message: "Cancel failed" });
  }
};

module.exports = { createBooking, getUserBookings, getAllBookings, deleteBooking, cancelBooking, getBookingHistory };
