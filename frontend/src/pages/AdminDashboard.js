import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalMovies: 0, totalBookings: 0, totalRevenue: 0 });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newMovie, setNewMovie] = useState({
    title: '', description: '', posterUrl: '', language: '', genre: '', rating: '', trailerUrl: ''
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const moviesRes = await API.get('/movies');
        setMovies(moviesRes.data);

        // Assuming an admin stats endpoint or calculating manually:
        try {
          const statsRes = await API.get('/admin/stats');
          setStats(statsRes.data);
        } catch (e) {
          // Fallback generic calculation if stats endpoint not built
          setStats({
            totalMovies: moviesRes.data.length,
            totalBookings: 15, // Mock
            totalRevenue: 3000 // Mock
          });
        }
      } catch (error) {
        console.error("Admin fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/movies', newMovie);
      setMovies([...movies, res.data]);
      setStats({ ...stats, totalMovies: stats.totalMovies + 1 });
      setNewMovie({ title: '', description: '', posterUrl: '', language: '', genre: '', rating: '', trailerUrl: '' });
      alert("Movie Added Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add movie.");
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/movies/${id}`);
      setMovies(movies.filter(m => m._id !== id));
      setStats({ ...stats, totalMovies: stats.totalMovies - 1 });
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie.");
    }
  };

  const theme = { bg: '#0a0a0a', cardBg: 'rgba(255,255,255,0.05)', accent: '#e50914', text: '#fff' };
  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#111', color: '#fff' };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '40px 20px', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Admin Dashboard</h1>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          {[{ label: 'Total Movies', value: stats.totalMovies, color: '#007bff' },
          { label: 'Total Bookings', value: stats.totalBookings, color: '#28a745' },
          { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, color: '#ffc107' }].map((s, i) => (
            <div key={i} style={{ background: theme.cardBg, padding: '30px', borderRadius: '16px', borderLeft: `5px solid ${s.color}`, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '1.1rem' }}>{s.label}</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          {/* ADD MOVIE FORM */}
          <div style={{ background: theme.cardBg, padding: '30px', borderRadius: '16px' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: `2px solid ${theme.accent}`, display: 'inline-block', paddingBottom: '5px' }}>Add Movie</h2>
            <form onSubmit={handleAddMovie}>
              <input style={inputStyle} type="text" placeholder="Title" required value={newMovie.title} onChange={e => setNewMovie({ ...newMovie, title: e.target.value })} />
              <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} placeholder="Description" required value={newMovie.description} onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}></textarea>
              <input style={inputStyle} type="text" placeholder="Poster URL" value={newMovie.posterUrl} onChange={e => setNewMovie({ ...newMovie, posterUrl: e.target.value })} />
              <input style={inputStyle} type="text" placeholder="Language" required value={newMovie.language} onChange={e => setNewMovie({ ...newMovie, language: e.target.value })} />
              <input style={inputStyle} type="text" placeholder="Genre" required value={newMovie.genre} onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })} />
              <input style={inputStyle} type="number" step="0.1" placeholder="Rating (0-10)" value={newMovie.rating} onChange={e => setNewMovie({ ...newMovie, rating: e.target.value })} />
              <input style={inputStyle} type="text" placeholder="Trailer YouTube URL" value={newMovie.trailerUrl} onChange={e => setNewMovie({ ...newMovie, trailerUrl: e.target.value })} />
              <button type="submit" style={{ width: '100%', padding: '15px', background: theme.accent, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>Publish Movie</button>
            </form>
          </div>

          {/* MANAGE MOVIES */}
          <div style={{ background: theme.cardBg, padding: '30px', borderRadius: '16px' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: `2px solid #007bff`, display: 'inline-block', paddingBottom: '5px' }}>Manage Movies</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {movies.map(movie => (
                <div key={movie._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{movie.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa' }}>{movie.language} • {movie.genre}</p>
                  </div>
                  <button onClick={() => handleDeleteMovie(movie._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </div>
              ))}
              {movies.length === 0 && <p style={{ color: '#aaa' }}>No movies found in database.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
