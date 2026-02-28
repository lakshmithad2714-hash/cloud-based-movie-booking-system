import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import AdminDashboard from './pages/AdminDashboard';
import Verify from './pages/Verify';
import Refreshments from './pages/Refreshments';
import Contact from './pages/Contact';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingHistory from './pages/BookingHistory';
import LikedMovies from './pages/LikedMovies';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/seats/:movieId" element={<SeatSelection />} />
          <Route path="/refreshments" element={<Refreshments />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/liked" element={<LikedMovies />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
