import React from 'react';
import MovieCard from './MovieCard';
import '../styles/movielist.css';

export default function MovieList({movies}) {
  return (
    <section className="movies">
      <div className="movies-grid">
        {movies.map(m => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
