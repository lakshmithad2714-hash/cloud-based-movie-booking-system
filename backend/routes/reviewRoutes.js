const express = require('express');
const { postReview, getMovieReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:movieId', getMovieReviews);
router.post('/', authMiddleware, postReview);

module.exports = router;
