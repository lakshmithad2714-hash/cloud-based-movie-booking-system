const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  movieId: { type: String, required: true },
  showTime: { type: String, required: true },
  movieTitle: { type: String },
  moviePoster: { type: String },
  movieLanguage: { type: String },
  seats: [{ type: String }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Booked', 'Cancelled'], default: 'Booked' },
  refundAmount: { type: Number, default: 0 },
  refreshments: [
    {
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number }
    }
  ],
  refreshmentTotal: { type: Number, default: 0 },
  seatTotal: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  bookingId: { type: String, unique: true },
  paymentMethod: { type: String, enum: ['upi', 'card', 'cash'], default: 'cash' },
  email: { type: String, required: true },
  phone: { type: String },
  phoneNumber: { type: String, required: true }
}, { timestamps: true });

// Auto-generate bookingId before save
BookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'MB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
