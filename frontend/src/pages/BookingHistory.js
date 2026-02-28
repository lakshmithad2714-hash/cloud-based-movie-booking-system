import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Clock, Armchair, Coffee, CreditCard, XCircle, CheckCircle } from 'lucide-react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = { bg: '#0b0c10', text: '#fff', accent: '#e50914', panelBg: 'rgba(255,255,255,0.05)' };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/history");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/bookings/cancel/${id}`);
      alert(res.data.message + (res.data.refund ? ` Refund Amount: ₹${res.data.refund}` : ""));
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Loading History...</div>;

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Ticket size={40} color={theme.accent} /> Booking History
        </h1>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: theme.panelBg, borderRadius: '15px' }}>
            <h3>No bookings found.</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' }}>
            {bookings.map(booking => (
              <div key={booking._id} style={{
                background: theme.panelBg, borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', gap: '20px', position: 'relative'
              }}>
                <img src={booking.moviePoster || 'https://via.placeholder.com/150'} alt={booking.movieTitle} style={{ width: '100px', borderRadius: '10px', objectFit: 'cover' }} />

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{booking.movieTitle}</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.9rem', color: '#ccc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color={theme.accent} /> {booking.showTime}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Armchair size={16} color={theme.accent} /> {booking.seats?.join(', ')}
                    </div>
                    {booking.refreshments?.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Coffee size={16} color={theme.accent} /> {booking.refreshments.map(r => `${r.name} x${r.quantity}`).join(', ')}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={16} color={theme.accent} /> Total: ₹{booking.grandTotal || booking.totalPrice}
                    </div>
                  </div>

                  <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                      background: booking.status === 'Cancelled' ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0, 200, 83, 0.2)',
                      color: booking.status === 'Cancelled' ? '#e50914' : '#00c853'
                    }}>
                      {booking.status}
                    </span>

                    {booking.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        style={{
                          background: 'transparent', border: '1px solid #e50914', color: '#e50914',
                          padding: '5px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem',
                          display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.3s'
                        }}
                        onMouseOver={e => { e.target.style.background = '#e50914'; e.target.style.color = '#fff'; }}
                        onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#e50914'; }}
                      >
                        <XCircle size={14} /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
