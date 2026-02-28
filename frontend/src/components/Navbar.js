import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, Heart, History, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, selectedCity, updateCity } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const cities = ['Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Hyderabad'];

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/');
    };

    const close = () => setMenuOpen(false);
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={close}>
                    <span className="navbar-logo-icon">🎬</span>
                    <span><span className="logo-movie">Movie</span><span className="logo-book">Book</span></span>
                </Link>

                <div className="city-selector-nav">
                    <MapPin size={18} className="city-pin" />
                    <select
                        value={selectedCity}
                        onChange={(e) => updateCity(e.target.value)}
                        className="city-select"
                    >
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>

                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <li><Link to="/" className={isActive('/')} onClick={close}>Home</Link></li>
                    {user && (
                        <li><Link to="/liked" className={isActive('/liked')} onClick={close}>❤️ Liked</Link></li>
                    )}
                    {user && (
                        <li><Link to="/history" className={isActive('/history')} onClick={close}><History size={18} style={{ marginRight: '5px' }} /> History</Link></li>
                    )}
                    {user && user.role === 'admin' && (
                        <li><Link to="/admin" className={isActive('/admin')} onClick={close}>Admin</Link></li>
                    )}
                    {user ? (
                        <li><button className="nav-btn-logout" onClick={handleLogout}>Logout</button></li>
                    ) : (
                        <li><Link to="/login" className={isActive('/login')} onClick={close}>Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
