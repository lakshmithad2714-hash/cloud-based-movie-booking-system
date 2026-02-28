const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true }, // TMDB ID
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
