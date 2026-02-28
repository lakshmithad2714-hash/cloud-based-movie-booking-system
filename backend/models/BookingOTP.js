const mongoose = require('mongoose');

const BookingOTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailOTP: { type: String, required: true },
    phoneOTP: { type: String, required: true },
    expiry: { type: Date, required: true },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-delete after 10 minutes (slightly longer than expiry of 5 mins)
BookingOTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('BookingOTP', BookingOTPSchema);
