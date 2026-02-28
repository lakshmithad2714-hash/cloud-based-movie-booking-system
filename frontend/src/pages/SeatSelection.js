import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Clock, MapPin, Armchair, CheckCircle } from 'lucide-react';

const SeatSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { movieId: paramId } = useParams();
    const [searchParams] = useSearchParams();
    const paramShowTime = searchParams.get('showTime');

    // Receive state from MovieDetails or use params
    const { movie: stateMovie, showTime: stateShowTime, city } = location.state || {};
    const movie = stateMovie || { id: paramId, title: "Movie" };
    const showTime = stateShowTime || paramShowTime;

    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);

    // Grid config
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];
    const ticketPrice = 200;

    useEffect(() => {
        setBookedSeats(['C3', 'C4', 'D1', 'D2']);
    }, [movie, showTime]);

    if (!movie || !showTime) {
        return (
            <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>
                <h2>No show details found.</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleConfirm = () => {
        if (selectedSeats.length === 0) return alert('Please select at least one seat.');

        navigate('/refreshments', {
            state: {
                movieId: movie.id || movie._id || paramId,
                showTime,
                city,
                selectedSeats,
                movie
            }
        });
    };

    const theme = {
        bg: '#0b0c10',
        card: '#1a1a2e',
        accent: '#e50914',
        available: 'rgba(255,255,255,0.1)',
        selected: '#00c853',
        booked: 'rgba(229, 9, 20, 0.3)'
    };

    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Select <span className="highlight">Seats</span></h1>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Today</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {showTime}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {city || 'Bangalore'}</div>
                </div>
            </div>

            <div className="screen-indicator">
                <div className="screen-bar"></div>
                <div className="screen-label">SCREEN THIS WAY</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '50px' }}>
                {rows.map(row => (
                    <div key={row} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ width: '24px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{row}</span>
                        {cols.map(col => {
                            const seatId = `${row}${col}`;
                            const isBooked = bookedSeats.includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                                <button
                                    key={seatId}
                                    onClick={() => handleSeatClick(seatId)}
                                    disabled={isBooked}
                                    style={{
                                        width: '36px', height: '32px',
                                        backgroundColor: isSelected ? theme.selected : (isBooked ? theme.booked : theme.available),
                                        border: `1px solid ${isSelected ? theme.selected : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '6px 6px 2px 2px',
                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        color: isSelected ? '#fff' : (isBooked ? 'transparent' : 'rgba(255,255,255,0.4)'),
                                        fontSize: '0.65rem'
                                    }}
                                >
                                    {col}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="seat-legend">
                <div className="seat-legend-item"><div className="legend-box available"></div> Available</div>
                <div className="seat-legend-item"><div className="legend-box selected"></div> Selected</div>
                <div className="seat-legend-item"><div className="legend-box booked"></div> Occupied</div>
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '25px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>{movie.title}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedSeats.length} Tickets Selected</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ margin: 0, color: 'var(--success)' }}>₹{selectedSeats.length * ticketPrice}</h2>
                    </div>
                </div>

                {selectedSeats.length > 0 && (
                    <div className="seat-summary-seats" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
                        {selectedSeats.map(s => <span key={s} className="seat-tag">{s}</span>)}
                    </div>
                )}

                <button
                    onClick={handleConfirm}
                    disabled={selectedSeats.length === 0}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}
                >
                    Continue to Refreshments
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;
