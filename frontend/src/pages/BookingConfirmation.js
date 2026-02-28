import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const BookingConfirmation = () => {
    const location = useLocation();
    const booking = location.state?.booking;
    const user = JSON.parse(localStorage.getItem('user')) || {};

    if (!booking) {
        return <Navigate to="/" />;
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        const accentColor = [229, 9, 20]; // #e50914

        // Title
        doc.setFontSize(24);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text('MOVIEBOOK TICKET', 105, 20, { align: 'center' });

        // Divider
        doc.setDrawColor(200);
        doc.line(20, 30, 190, 30);

        // Booking Info
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Booking ID:', 20, 45);
        doc.setTextColor(0);
        doc.text(booking.bookingId || booking._id, 60, 45);

        doc.setTextColor(100);
        doc.text('Movie Title:', 20, 55);
        doc.setTextColor(0);
        doc.text(booking.movieTitle || 'Movie Name', 60, 55);

        doc.setTextColor(100);
        doc.text('Date & Time:', 20, 65);
        doc.setTextColor(0);
        doc.text(`${new Date().toLocaleDateString()} at ${booking.showTime}`, 60, 65);

        // SEATS BREAKDOWN
        doc.line(20, 75, 190, 75);
        doc.setFontSize(14);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text('Seats', 20, 85);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`${booking.seats.length} x Seat (₹200)`, 20, 95);
        doc.text(`₹${booking.seatTotal || (booking.seats.length * 200)}`, 160, 95);

        // REFRESHMENTS BREAKDOWN
        let currentY = 110;
        if (booking.refreshments && booking.refreshments.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.text('Refreshments', 20, currentY);
            currentY += 10;

            doc.setFontSize(12);
            doc.setTextColor(0);
            booking.refreshments.forEach(item => {
                doc.text(`${item.name} x ${item.quantity}`, 20, currentY);
                doc.text(`₹${item.price * item.quantity}`, 160, currentY);
                currentY += 10;
            });

            doc.setTextColor(100);
            doc.text('Refreshments Total:', 20, currentY);
            doc.setTextColor(0);
            doc.text(`₹${booking.refreshmentTotal || 0}`, 160, currentY);
            currentY += 15;
        }

        // TOTAL
        doc.line(20, currentY, 190, currentY);
        currentY += 10;
        doc.setFontSize(16);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text('Grand Total:', 20, currentY);
        doc.text(`₹${booking.grandTotal || booking.totalPrice}`, 160, currentY);
        currentY += 20;

        // User Info
        doc.line(20, currentY, 190, currentY);
        currentY += 10;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Contact Details', 20, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Email:', 20, currentY);
        doc.setTextColor(0);
        doc.text(booking.email || 'N/A', 60, currentY);
        currentY += 10;

        doc.setTextColor(100);
        doc.text('Phone:', 20, currentY);
        doc.setTextColor(0);
        doc.text(booking.phoneNumber || 'N/A', 60, currentY);
        currentY += 20;

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for booking with MovieBook!', 105, currentY, { align: 'center' });

        doc.save(`Ticket_${booking._id}.pdf`);
    };

    const theme = { bg: '#0a0a0a', text: '#fff', accent: '#e50914', panelBg: 'rgba(255,255,255,0.05)' };

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ background: theme.panelBg, padding: '40px', borderRadius: '20px', maxWidth: '500px', width: '100%', textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <div style={{ width: '80px', height: '80px', background: '#28a745', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', fontSize: '2.5rem', color: '#fff', boxShadow: '0 0 20px rgba(40, 167, 69, 0.4)' }}>
                    ✓
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Booking Confirmed!</h1>
                <p style={{ color: '#aaa', marginBottom: '30px' }}>Your tickets have been successfully booked.</p>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '30px' }}>
                    <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9rem' }}>Booking ID</p>
                    <p style={{ margin: '0 0 15px', fontWeight: 'bold' }}>{booking._id}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9rem' }}>Date & Time</p>
                            <p style={{ margin: '0', fontWeight: 'bold' }}>{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                            <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9rem' }}>Seats</p>
                            <p style={{ margin: '0', fontWeight: 'bold' }}>{booking.seats.join(', ')}</p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px dashed #444', marginTop: '20px', paddingTop: '20px' }}>
                        <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9rem' }}>Refreshments</p>
                        {booking.refreshments?.length > 0 ? (
                            booking.refreshments.map((r, i) => (
                                <p key={i} style={{ margin: '0', fontSize: '0.9rem' }}>{r.name} x {r.quantity} (₹{r.price * r.quantity})</p>
                            ))
                        ) : (
                            <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>No refreshments added</p>
                        )}
                    </div>

                    <div style={{ borderTop: '1px dashed #444', marginTop: '20px', paddingTop: '20px' }}>
                        <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9rem' }}>Contact Details</p>
                        <p style={{ margin: '0', fontSize: '0.95rem' }}>{booking.email}</p>
                        <p style={{ margin: '5px 0 0', fontSize: '0.95rem' }}>{booking.phoneNumber}</p>
                    </div>

                    <div style={{ borderTop: '1px dashed #444', marginTop: '20px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Amount Paid</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: theme.accent }}>₹{booking.totalAmount || booking.totalPrice}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={generatePDF} style={{ flex: 1, padding: '12px', background: 'transparent', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' }}>
                        Download PDF
                    </button>
                    <Link to="/" style={{ flex: 1, padding: '12px', background: theme.accent, color: '#fff', border: 'none', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s' }}>
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
