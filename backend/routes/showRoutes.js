const express = require('express');
const { getShows, getShowById, createShow, updateShow, deleteShow } = require('../controllers/showController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// GET /api/shows - Get all shows (with optional movieId filter) (public)
router.get('/', getShows);

// GET /api/shows/:id - Get show by ID (public)
router.get('/:id', getShowById);

// POST /api/shows - Create show (admin only)
router.post('/', authMiddleware, adminMiddleware, createShow);

// PUT /api/shows/:id - Update show (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateShow);

// DELETE /api/shows/:id - Delete show (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteShow);

module.exports = router;
