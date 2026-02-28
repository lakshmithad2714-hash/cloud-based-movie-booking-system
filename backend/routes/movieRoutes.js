const express = require('express');
const {
    getMovies,
    getMovieById,
    getTMDBMovies,
    getMovieVideos
} = require('../controllers/movieController');

const router = express.Router();

// TMDB ROUTES (IMPORTANT FIRST)
router.get('/tmdb', getTMDBMovies);
router.get('/tmdb/:id/videos', getMovieVideos);

// DATABASE ROUTES
router.get('/', getMovies);
router.get('/:id', getMovieById);

module.exports = router;