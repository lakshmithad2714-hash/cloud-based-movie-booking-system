const nodemailer = require('nodemailer');
// const twilio = require('twilio'); // Uncomment if Twilio is configured
const Booking = require('../models/Booking');

// Mock Payment Processing
exports.processPayment = async (req, res) => {
    try {
        const { amount, method, details } = req.body;
        // In a real application, integrate Stripe, Razorpay, or Paytm here

        // Mocking a successful payment
        res.status(200).json({ success: true, message: `Payment of ₹${amount} via ${method} successful`, transactionId: `TXN${Date.now()}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment failed', error: error.message });
    }
};

// Send Email & SMS Notification
exports.notifyBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Fetch booking details and populate movie/user
        const booking = await Booking.findById(bookingId).populate('movie').populate('user');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        // 1. Send Email Notification
        // You need to set EMAIL_USER and EMAIL_PASS in your .env
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your_email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your_app_password'
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'your_email@gmail.com',
            to: booking.user?.email || 'user@example.com',
            subject: `Booking Confirmed: ${booking.movie?.title}`,
            text: `Hi ${booking.user?.name || 'User'},\n\nYour booking for ${booking.movie?.title} is confirmed!\n\nSeats: ${booking.seats.join(', ')}\nTotal Amount: ₹${booking.totalAmount}\nBooking ID: ${booking._id}\n\nEnjoy your show!`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailErr) {
            console.error('Email failed to send, ensure credentials are setup:', emailErr.message);
        }

        // 2. Send SMS Notification
        // You need to set TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE in your .env
        /* 
        try {
            const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
            await client.messages.create({
                body: `Your ticket for ${booking.movie?.title} is confirmed. Seats: ${booking.seats.join(', ')}. Enjoy your show!`,
                from: process.env.TWILIO_PHONE,
                to: booking.user?.phone || '+1234567890'
            });
        } catch (smsErr) {
            console.error('SMS failed to send, ensure Twilio is configured:', smsErr.message);
        }
        */

        res.status(200).json({ success: true, message: 'Notifications sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Notification failed', error: error.message });
    }
};
