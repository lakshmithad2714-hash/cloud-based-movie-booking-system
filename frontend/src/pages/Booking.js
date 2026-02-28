import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showsAPI, bookingsAPI } from '../services/api';
import '../styles/booking.css';

export default function Booking() {
  const { showId, movieId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShow();
  }, [showId]);

  const fetchShow = async () => {
    try {
      const res = await showsAPI.getById(showId);
      setShow(res.data);
    } catch (err) {
      setError('Failed to fetch show details');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }

      const res = await bookingsAPI.create({
        showId,
        movieId,
        seats: selectedSeats,
      });

      alert('Booking successful!');
      navigate(`/booking-history`);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (!show) return <p style={{ textAlign: 'center' }}>Show not found</p>;

  // Simple grid (8 rows x 10 seats = 80 seats)
  const rows = 8;
  const cols = 10;
  const seats = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      seats.push(`${String.fromCharCode(65 + i)}${j + 1}`);
    }
  }

  return (
    <div className="booking-container">
      <h2>Select Your Seats</h2>
      {error && <p className="error">{error}</p>}

      <div className="screen">SCREEN</div>

      <div className="seats-grid">
        {seats.map(seat => (
          <button
            key={seat}
            className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
            onClick={() => toggleSeat(seat)}
          >
            {seat}
          </button>
        ))}
      </div>

      <div className="booking-summary">
        <p>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
        <p>Total Price: ₹{selectedSeats.length * show.price}</p>
        <button
          className="btn-confirm"
          onClick={handleBooking}
          disabled={bookingLoading}
        >
          {bookingLoading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
