import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bms-header">
      <div className="bms-container">
        <Link to="/" className="logo">🎬 BookMyShow</Link>
        <div className="nav">
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <Link to="/booking-history">My Bookings</Link>
              {user.isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Sign In</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
