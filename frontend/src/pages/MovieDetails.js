import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Play, Heart, Clock, Globe, Calendar, Info, X, MessageSquare, User as UserIcon, Send, MapPin } from 'lucide-react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCity: globalCity, user, toggleFavorite, updateCity } = useAuth();

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 10, comment: '' });
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLiked, setIsLiked] = useState(user?.wishlist?.includes(id.toString()) || false);
  const [loading, setLoading] = useState(!movie);
  const [postingReview, setPostingReview] = useState(false);

  // Static Show Times
  const showTimes = [
    "10:00 AM",
    "01:00 PM",
    "04:00 PM",
    "07:00 PM",
    "10:00 PM"
  ];

  const cities = ["Bangalore", "Chennai", "Mumbai", "Delhi", "Hyderabad"];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!movie) {
          const res = await API.get(`/movies/tmdb/${id}`);
          setMovie(res.data);
        }

        const [videosRes, reviewsRes] = await Promise.all([
          API.get(`/movies/${id}/videos`).catch(() => ({ data: [] })),
          API.get(`/reviews/${id}`).catch(() => ({ data: [] }))
        ]);

        setReviews(reviewsRes?.data || []);

        const videos = videosRes?.data || [];
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
          console.log("No YouTube trailer found for this movie.");
        }

      } catch (err) {
        console.error("Fetch Movie Details Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, movie]);

  useEffect(() => {
    setIsLiked(user?.wishlist?.includes(id.toString()) || false);
  }, [user, id]);

  const handleToggleLike = async () => {
    if (!user) return alert("Please login to add to wishlist");
    try {
      await toggleFavorite(id);
      setIsLiked(!isLiked);
    } catch (err) {
      alert("Failed to update wishlist");
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to post a review");
    try {
      setPostingReview(true);
      const res = await API.post('/reviews', { movieId: id, rating: newReview.rating, comment: newReview.comment });
      setReviews([res.data.review, ...reviews.filter(r => r.user !== user._id)]);
      setNewReview({ rating: 10, comment: '' });
      alert("Review posted successfully!");
    } catch (err) {
      alert("Failed to post review");
    } finally {
      setPostingReview(false);
    }
  };

  const handleShowTimeClick = (time) => {
    navigate(`/seats/${id}?showTime=${time}`, {
      state: {
        movie,
        showTime: time
      }
    });
  };

  if (loading || !movie) return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-text">Loading cinematic details...</p>
    </div>
  );

  const bannerImg = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : (movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : '');

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : (movie.vote_average?.toFixed(1) || 'N/A');

  return (
    <div className="movie-details-page">
      <div className="movie-detail-banner">
        <div className="movie-detail-banner-bg" style={{ backgroundImage: `url(${bannerImg})` }}></div>
        <div className="movie-detail-banner-gradient"></div>

        <div className="movie-detail-content">
          <motion.img
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="movie-detail-poster"
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x450"}
            alt={movie.title}
          />

          <div className="movie-detail-info">
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              {movie.title}
            </motion.h1>

            <div className="movie-detail-badges">
              <span className="detail-badge rating-b"><Star size={14} fill="currentColor" /> {averageRating} / 10</span>
              <span className="detail-badge lang-b"><Globe size={14} /> {movie.original_language?.toUpperCase()}</span>
              {movie.release_date && <span className="detail-badge dur-b"><Calendar size={14} /> {new Date(movie.release_date).getFullYear()}</span>}
            </div>

            <p className="movie-detail-desc">{movie.overview || "No description available."}</p>

            <div className="movie-detail-actions">
              {trailerKey ? (
                <button className="btn btn-ghost" onClick={() => setShowTrailer(true)}>
                  <Play size={18} fill="currentColor" /> Watch Trailer
                </button>
              ) : (
                <button className="btn btn-ghost" disabled title="Trailer not available">
                  <Play size={18} opacity={0.5} /> Trailer Not Available
                </button>
              )}

              <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleToggleLike}>
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} color={isLiked ? "var(--primary)" : "white"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Left: Shows & Reviews */}
        <div>
          <section className="detail-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="section-title">Select Show Time</h2>
              <div className="city-selector-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <MapPin size={16} color="var(--primary)" />
                <select
                  value={globalCity}
                  onChange={(e) => updateCity(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                  {cities.map(c => <option key={c} value={c} style={{ background: '#000' }}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="shows-grid">
              {showTimes.map(time => (
                <button
                  key={time}
                  onClick={() => handleShowTimeClick(time)}
                  className="show-time-card"
                  style={{ background: 'rgba(255,255,255,0.05)', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="show-time">{time}</div>
                  <div className="show-info">Premium Screen • ₹250</div>
                  <div className="seat-count">Available in {globalCity}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="detail-section" style={{ marginTop: '50px' }}>
            <h2 className="section-title">User Reviews</h2>
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="user-info">
                      <div className="user-avatar"><UserIcon size={16} /></div>
                      <span className="user-name">{review.userName}</span>
                    </div>
                    <div className="review-rating"><Star size={14} fill="currentColor" /> {review.rating}</div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to rate!</p>}
            </div>
          </section>
        </div>

        {/* Right: Write Review */}
        <aside>
          <div className="card review-form-card">
            <h3>Rate this movie</h3>
            <form onSubmit={handlePostReview}>
              <div className="form-group">
                <label>Rating (1-10)</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={newReview.rating >= n ? 'active' : ''}
                      onClick={() => setNewReview({ ...newReview, rating: n })}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your thoughts</label>
                <textarea
                  placeholder="What did you think of the movie?"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={postingReview}>
                {postingReview ? 'Posting...' : <><Send size={16} /> Post Review</>}
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTrailer(false)}>
            <motion.div className="modal-content trailer-modal" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowTrailer(false)}><X size={24} /></button>
              <div className="player-wrapper">
                <ReactPlayer
                  url={`https://www.youtube.com/embed/${trailerKey}`}
                  width="100%"
                  height="100%"
                  playing={true}
                  controls={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieDetails;
