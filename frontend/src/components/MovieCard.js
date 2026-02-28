import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, children }) => {
  const navigate = useNavigate();

  return (
    <div className="card movie-card" onClick={() => navigate(`/movie/${movie._id}`)} style={{ position: 'relative' }}>
      {children}
      <div className="movie-card-poster-wrap">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="movie-card-poster" />
        ) : (
          <div className="movie-card-placeholder">🎬</div>
        )}
        <div className="movie-card-overlay">
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie._id}`); }}>
            View Details
          </button>
        </div>
      </div>
      <div className="movie-card-body">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta">
          {movie.language && <span className="badge badge-lang">{movie.language}</span>}
          {movie.genre && movie.genre.map((g, i) => (
            <span key={i} className="badge badge-genre">{g}</span>
          ))}
        </div>
        {movie.rating > 0 && (
          <div className="movie-card-rating">⭐ {movie.rating.toFixed(1)}</div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
