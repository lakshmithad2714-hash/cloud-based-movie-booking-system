const Show = require('../models/Show');

// GET /api/shows - Get all shows (with optional movie filter)
const getShows = async (req, res) => {
  try {
    const { movieId, city } = req.query;
    let filter = {};
    if (movieId) filter.movie = movieId;
    if (city) filter.city = city;

    const shows = await Show.find(filter).populate('movie', 'title language genre');
    res.status(200).json(shows);
  } catch (err) {
    console.error('Get shows error:', err.message);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
};

// GET /api/shows/:id - Get show by ID
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie');
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.status(200).json(show);
  } catch (err) {
    console.error('Get show error:', err.message);
    res.status(500).json({ error: 'Failed to fetch show' });
  }
};

// POST /api/shows - Create show (admin only)
const createShow = async (req, res) => {
  try {
    const { movieId, date, startTime, screen, totalSeats, price, city } = req.body;

    if (!movieId || !date || !startTime) {
      return res.status(400).json({ error: 'Movie ID, date, and start time required' });
    }

    const show = new Show({ movie: movieId, date, startTime, screen, totalSeats, price, city: city || 'Bangalore' });
    await show.save();

    res.status(201).json({ message: 'Show created', show });
  } catch (err) {
    console.error('Create show error:', err.message);
    res.status(500).json({ error: 'Failed to create show' });
  }
};

// PUT /api/shows/:id - Update show (admin only)
const updateShow = async (req, res) => {
  try {
    const { date, startTime, screen, totalSeats, price } = req.body;

    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { date, startTime, screen, totalSeats, price },
      { new: true, runValidators: true }
    );

    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(200).json({ message: 'Show updated', show });
  } catch (err) {
    console.error('Update show error:', err.message);
    res.status(500).json({ error: 'Failed to update show' });
  }
};

// DELETE /api/shows/:id - Delete show (admin only)
const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(200).json({ message: 'Show deleted', show });
  } catch (err) {
    console.error('Delete show error:', err.message);
    res.status(500).json({ error: 'Failed to delete show' });
  }
};

module.exports = { getShows, getShowById, createShow, updateShow, deleteShow };
