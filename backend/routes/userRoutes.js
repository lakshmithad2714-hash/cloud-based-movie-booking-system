const express = require('express');
const { toggleWishlist, getWishlist } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist/toggle', authMiddleware, toggleWishlist);

module.exports = router;
