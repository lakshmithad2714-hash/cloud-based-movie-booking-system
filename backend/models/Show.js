const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  date: { type: Date, required: true },
  startTime: { type: String },
  screen: { type: String },
  totalSeats: { type: Number, default: 100 },
  seatLayout: { type: Object },
  price: { type: Number, default: 100 },
  city: { type: String, default: 'Bangalore' },
}, { timestamps: true });

module.exports = mongoose.model('Show', ShowSchema);
