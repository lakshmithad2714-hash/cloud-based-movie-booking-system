const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// GET /api/admin/stats - Get dashboard statistics (admin only)
router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
