const User = require('../models/User');
const axios = require('axios');

/**
 * Add or remove movie from wishlist
 */
const toggleWishlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.wishlist.indexOf(movieId);
    if (index === -1) {
      user.wishlist.push(movieId);
      await user.save();
      return res.status(200).json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
};

/**
 * Get user's wishlist movies with details from TMDB
 */
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const wishlistDetails = await Promise.all(
      user.wishlist.map(async (movieId) => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`
          );
          return response.data;
        } catch (err) {
          console.error(`Failed to fetch TMDB movie ${movieId}`);
          return null;
        }
      })
    );

    res.status(200).json(wishlistDetails.filter(m => m !== null));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

module.exports = { toggleWishlist, getWishlist };
