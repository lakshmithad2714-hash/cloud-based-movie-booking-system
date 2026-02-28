import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, ArrowRight, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LikedMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toggleFavorite } = useAuth();

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await API.get('/users/wishlist');
            setMovies(res.data);
        } catch (err) {
            console.error("Fetch Wishlist Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (e, movieId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await toggleFavorite(movieId);
            setMovies(movies.filter(m => m.id.toString() !== movieId.toString() && m._id?.toString() !== movieId.toString()));
        } catch (err) {
            alert("Failed to remove from wishlist");
        }
    };

    if (loading) return (
        <div className="loader-container">
            <div className="loader-spinner"></div>
            <p className="loader-text">Opening your movie vault...</p>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My <span className="highlight">Wishlist</span></h1>
                <p>Movies you've saved to watch later.</p>
            </div>

            <AnimatePresence>
                {movies.length > 0 ? (
                    <motion.div
                        className="movie-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {movies.map(movie => (
                            <motion.div
                                key={movie.id || movie._id}
                                className="card movie-card"
                                layout
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <Link to={`/movie/${movie.id || movie._id}`} state={{ movie }}>
                                    <div className="movie-card-poster-wrap">
                                        <img
                                            className="movie-card-poster"
                                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : (movie.posterUrl || "https://via.placeholder.com/300x450")}
                                            alt={movie.title}
                                        />
                                        <div className="movie-card-overlay">
                                            <button
                                                className="like-btn liked"
                                                onClick={(e) => handleRemove(e, movie.id || movie._id)}
                                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)' }}
                                            >
                                                <Heart size={20} fill="var(--primary)" color="var(--primary)" />
                                            </button>
                                            <button className="btn btn-primary btn-sm">
                                                Details <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="movie-card-body">
                                        <h3 className="movie-card-title">{movie.title}</h3>
                                        <div className="movie-card-meta">
                                            <span className="badge badge-lang">{(movie.original_language || movie.language)?.toUpperCase()}</span>
                                            <div className="movie-card-rating">
                                                <Star size={14} fill="currentColor" />
                                                <span>{(movie.vote_average || movie.rating)?.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="no-data-state"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', padding: '100px 20px' }}
                    >
                        <Ghost size={64} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>Your wishlist is empty</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Explore movies and hit the heart icon to save them here.</p>
                        <Link to="/" className="btn btn-primary">Browse Movies</Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LikedMovies;
