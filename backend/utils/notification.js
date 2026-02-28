const nodemailer = require('nodemailer');

// Email transporter - configure in .env
const createTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendBookingEmail = async (userEmail, bookingDetails) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email not configured. Skipping email notification.');

            return;
        }

        const transporter = createTransporter();

        const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #f5f5f5; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #e50914, #b20710); padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎬 MovieBook</h1>
          <p style="margin: 4px 0 0; opacity: 0.9;">Booking Confirmed!</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #00c853; margin-bottom: 16px;">✅ Your ticket is booked!</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #a0a0b0;">Booking ID</td><td style="padding: 8px 0; font-weight: 600;">${bookingDetails.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; color: #a0a0b0;">Movie</td><td style="padding: 8px 0; font-weight: 600;">${bookingDetails.movieName}</td></tr>
            <tr><td style="padding: 8px 0; color: #a0a0b0;">Seats</td><td style="padding: 8px 0; font-weight: 600;">${bookingDetails.seats}</td></tr>
            <tr><td style="padding: 8px 0; color: #a0a0b0;">Date</td><td style="padding: 8px 0; font-weight: 600;">${bookingDetails.date}</td></tr>
            <tr><td style="padding: 8px 0; color: #a0a0b0;">Show Time</td><td style="padding: 8px 0; font-weight: 600;">${bookingDetails.showTime}</td></tr>
            <tr><td style="padding: 8px 0; color: #a0a0b0;">Total Amount</td><td style="padding: 8px 0; font-weight: 600; color: #00c853;">₹${bookingDetails.totalPrice}</td></tr>
          </table>
          <p style="margin-top: 24px; color: #a0a0b0; font-size: 14px;">Enjoy your movie! 🍿</p>
        </div>
      </div>
    `;

        await transporter.sendMail({
            from: `"MovieBook" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `🎬 Booking Confirmed - ${bookingDetails.movieName}`,
            html,
        });

        console.log('Booking email sent to:', userEmail);
    } catch (err) {
        console.error('Email send failed:', err.message);
    }
};

const sendBookingSMS = async (phone, bookingDetails) => {
    try {
        if (!process.env.SMS_API_KEY || !phone) {
            console.log('SMS not configured or phone missing. Skipping SMS.');
            return;
        }

        const message = `Your ticket for ${bookingDetails.movieName} at ${bookingDetails.showTime} is confirmed. Seats: ${bookingDetails.seats}. Booking ID: ${bookingDetails.bookingId}. Total: ₹${bookingDetails.totalPrice}. Enjoy your show!`;

        // Using Fast2SMS API (popular in India)
        const axios = require('axios');
        await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            route: 'q',
            message,
            language: 'english',
            flash: 0,
            numbers: phone,
        }, {
            headers: { authorization: process.env.SMS_API_KEY },
        });

        console.log('SMS sent to:', phone);
    } catch (err) {
        console.error('SMS send failed:', err.message);
    }
};

module.exports = { sendBookingEmail, sendBookingSMS };
