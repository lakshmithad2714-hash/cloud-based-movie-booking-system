const Review = require('../models/Review');

/**
 * Post a new review
 */
const postReview = async (req, res) => {
    try {
        const { movieId, rating, comment } = req.body;
        const userId = req.user.id;
        const userName = req.user.name;

        // Check if user already reviewed
        const existing = await Review.findOne({ user: userId, movieId });
        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            await existing.save();
            return res.status(200).json({ message: 'Review updated', review: existing });
        }

        const review = new Review({
            user: userId,
            movieId,
            userName,
            rating,
            comment
        });

        await review.save();
        res.status(201).json({ message: 'Review posted', review });
    } catch (err) {
        console.error("Post Review Error:", err);
        res.status(500).json({ error: 'Failed to post review' });
    }
};

/**
 * Get reviews for a movie
 */
const getMovieReviews = async (req, res) => {
    try {
        const { movieId } = req.params;
        const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

module.exports = { postReview, getMovieReviews };
