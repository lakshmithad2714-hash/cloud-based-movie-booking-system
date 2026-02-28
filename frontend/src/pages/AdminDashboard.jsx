import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { LayoutDashboard, ShoppingBag, XCircle, Film, User, CreditCard, Pizza } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await API.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Admin Stats Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-container"><div className="loader-spinner"></div></div>;

    return (
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <LayoutDashboard size={32} color="var(--primary)" />
                <h1 style={{ margin: 0 }}>Admin <span className="highlight">Dashboard</span></h1>
            </div>

            {/* STATS OVERVIEW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard icon={<ShoppingBag color="#00c853" />} title="Total Bookings" value={stats?.totalBookings} />
                <StatCard icon={<XCircle color="#ff5252" />} title="Cancelled Bookings" value={stats?.cancelledBookings} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
                {/* ACTIVE BOOKINGS */}
                <section>
                    <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Film size={24} /> Recent Bookings
                    </h2>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <tr>
                                        <th style={thStyle}>Movie</th>
                                        <th style={thStyle}>User</th>
                                        <th style={thStyle}>Seats</th>
                                        <th style={thStyle}>Time</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.bookedMoviesList.map((b, i) => (
                                        <tr key={i} style={trStyle}>
                                            <td style={tdStyle}>{b.title}</td>
                                            <td style={tdStyle}><span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> {b.userEmail}</span></td>
                                            <td style={tdStyle}>{b.seats}</td>
                                            <td style={tdStyle}>{b.showTime}</td>
                                            <td style={tdStyle}>₹{b.amount}</td>
                                            <td style={tdStyle}><span style={{ color: '#00c853', fontWeight: 'bold' }}>{b.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* CANCELLED BOOKINGS */}
                <section>
                    <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff5252' }}>
                        <XCircle size={24} /> Cancelled History
                    </h2>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <tr>
                                    <th style={thStyle}>Movie</th>
                                    <th style={thStyle}>Seats</th>
                                    <th style={thStyle}>Cancel Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.cancelledMoviesList.map((b, i) => (
                                    <tr key={i} style={trStyle}>
                                        <td style={tdStyle}>{b.title}</td>
                                        <td style={tdStyle}>{b.seats}</td>
                                        <td style={tdStyle}>{new Date(b.cancelDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }) => (
    <motion.div
        whileHover={{ translateY: -5 }}
        className="card"
        style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', background: 'var(--bg-card)' }}
    >
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>{icon}</div>
        <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{value}</h2>
        </div>
    </motion.div>
);

const thStyle = { padding: '15px 20px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' };
const tdStyle = { padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' };
const trStyle = { transition: 'background 0.2s' };

export default AdminDashboard;
