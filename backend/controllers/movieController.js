const Movie = require('../models/Movie');
const axios = require('axios');

// ============================
// GET ALL MOVIES FROM DB
// ============================
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    console.log("Movies fetched:", movies.length);
    res.status(200).json(movies);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};

// ============================
// GET MOVIE BY ID
// ============================
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (err) {
    console.error('Get movie error:', err.message);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
};

// ============================
// TMDB MOVIES (IMPORTANT FIX)
// ============================
const getTMDBMovies = async (req, res) => {
  try {
    const { language = "en" } = req.query;

    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_original_language: language === "all" ? undefined : language,
          sort_by: "popularity.desc",
          page: 1
        }
      }
    );

    res.status(200).json(response.data.results);

  } catch (error) {
    console.error("TMDB ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch TMDB movies" });
  }
};

// ============================
// GET MOVIE VIDEOS
// ============================
const getMovieVideos = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY
        }
      }
    );

    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("TMDB VIDEO ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch movie videos" });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getTMDBMovies,
  getMovieVideos
};