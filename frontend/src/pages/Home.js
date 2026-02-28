import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star, Languages, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/movies/tmdb?language=${selectedLanguage}`
        );

        const formattedMovies = res.data.map((movie) => ({
          id: movie.id,
          title: movie.title,
          language: movie.original_language?.toUpperCase(),
          rating: movie.vote_average,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/300x450"
        }));

        setMovies(formattedMovies);

      } catch (err) {
        console.error("Frontend TMDB error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedLanguage]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading movies...</h2>;
  }

  return (
    <div className="page-container">

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <Languages size={18} />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="kn">Kannada</option>
        </select>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <motion.div key={movie.id} className="card movie-card">
            <Link to={`/movie/${movie.id}`} state={{ movie }}>
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <h3>{movie.title}</h3>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{movie.language}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Star size={14} fill="currentColor" />
                  <span>{Number(movie.rating).toFixed(1)}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default Home;