const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  language: { type: String, default: 'English' },
  genre: [{ type: String }],
  description: { type: String },
  duration: { type: Number }, // minutes
  rating: { type: Number, default: 0 },
  posterUrl: { type: String },
  trailerUrl: { type: String },
  releaseDate: { type: Date },
  tmdbId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
