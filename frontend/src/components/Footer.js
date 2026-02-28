import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-brand">
                <div className="footer-logo">
                    Movie<span className="f-highlight">Book</span>
                </div>
                <p>Your one-stop destination for booking movie tickets online. Experience cinema like never before.</p>
            </div>
            <div className="footer-col">
                <h4>Explore</h4>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/booking-history">My Bookings</Link></li>
                    <li><Link to="/liked">Liked Movies</Link></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Help</h4>
                <ul>
                    <li><a href="#!">About Us</a></li>
                    <li><a href="#!">Contact</a></li>
                    <li><a href="#!">FAQs</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#!">Privacy Policy</a></li>
                    <li><a href="#!">Terms of Use</a></li>
                    <li><a href="#!">Refund Policy</a></li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            © {new Date().getFullYear()} MovieBook. All rights reserved.
        </div>
    </footer>
);

export default Footer;
