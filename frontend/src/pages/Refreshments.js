import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, CheckCircle, ArrowLeft } from 'lucide-react';

const Refreshments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movieId, showTime, selectedSeats, movie } = location.state || {};

    const [refreshments, setRefreshments] = useState([
        { id: 1, name: "Popcorn", price: 120, image: "/images/food/popcorn.svg" },
        { id: 2, name: "Juice", price: 80, image: "/images/food/juice.svg" },
        { id: 3, name: "Chats", price: 150, image: "/images/food/chats.svg" },
        { id: 4, name: "French Fries", price: 130, image: "/images/food/fries.svg" },
        { id: 5, name: "Lunch Combo", price: 250, image: "/images/food/combo.svg" },
        { id: 6, name: "Dinner Combo", price: 300, image: "/images/food/dinner.svg" },
        { id: 7, name: "Momos", price: 140, image: "/images/food/momos.svg" }
    ].map(item => ({ ...item, quantity: 0 })));

    if (!selectedSeats || selectedSeats.length === 0) {
        return (
            <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>
                <h2>No seats selected.</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    const seatTotal = selectedSeats.length * 200;
    const refreshmentTotal = refreshments.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const grandTotal = seatTotal + refreshmentTotal;

    const updateQuantity = (id, change) => {
        setRefreshments(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        ));
    };

    const handleProceed = () => {
        const activeRefreshments = refreshments.filter(r => r.quantity > 0).map(r => ({
            name: r.name,
            price: r.price,
            quantity: r.quantity
        }));

        navigate("/contact", {
            state: {
                movieId,
                showTime,
                selectedSeats,
                movie,
                refreshments: activeRefreshments,
                seatTotal,
                refreshmentTotal,
                grandTotal,
                totalAmount: grandTotal // for backward compatibility
            }
        });
    };

    const theme = {
        bg: '#0b0c10',
        panel: '#1a1a2e',
        accent: '#e50914',
        card: 'rgba(255,255,255,0.05)'
    };

    return (
        <div className="page-container" style={{ minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Add <span className="highlight">Refreshments</span></h1>
                    </div>
                    <div style={{ background: theme.panel, padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ color: '#888', marginRight: '10px' }}>Seats:</span>
                        <span style={{ fontWeight: 'bold' }}>{selectedSeats.join(', ')}</span>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                    {/* GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {refreshments.map(item => (
                            <div key={item.id} className="card refreshment-card" style={{ background: theme.card, padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.3s' }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/1037/1037762.png" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 5px', fontSize: '1.2rem' }}>{item.name}</h3>
                                    <p style={{ margin: '0 0 15px', color: 'var(--success)', fontWeight: 'bold' }}>₹{item.price}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Minus size={14} />
                                        </button>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: theme.accent, color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* BILLING */}
                    <aside>
                        <div className="card" style={{ background: theme.panel, padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: '20px' }}>
                            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ShoppingCart size={20} color={theme.accent} /> Billing Breakdown
                            </h3>

                            <div className="billing-details" style={{ marginBottom: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: '#888' }}>Seats Total ({selectedSeats.length} x ₹200)</span>
                                    <span>₹{seatTotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: '#888' }}>Refreshments Total</span>
                                    <span>₹{refreshmentTotal}</span>
                                </div>
                                {refreshments.filter(r => r.quantity > 0).map(r => (
                                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '5px', paddingLeft: '15px' }}>
                                        <span>{r.name} x {r.quantity}</span>
                                        <span>₹{r.price * r.quantity}</span>
                                    </div>
                                ))}

                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Grand Total</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)' }}>₹{grandTotal}</span>
                                </div>
                            </div>

                            <button onClick={handleProceed} className="btn btn-primary" style={{ width: '100%', padding: '15px', borderRadius: '12px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle size={20} /> Proceed to Pay
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Refreshments;
