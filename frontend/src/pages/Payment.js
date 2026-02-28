import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const [bookingData, setBookingData] = useState(() => {
        const stateData = location.state?.bookingPayload || location.state;
        if (stateData && stateData.seats) {
            sessionStorage.setItem('pendingBooking', JSON.stringify(stateData));
            return stateData;
        }
        const savedData = sessionStorage.getItem('pendingBooking');
        return savedData ? JSON.parse(savedData) : {};
    });

    if (!bookingData.seats) {
        return (
            <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <h2>Invalid Booking Request</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
            </div>
        );
    }

    const theme = { bg: '#0a0a0a', text: '#fff', accent: '#e50914', panelBg: 'rgba(255,255,255,0.05)' };

    const handleSendOTP = async () => {
        if (!email.includes('@') || phone.length < 10) {
            alert('Please enter a valid email and phone number');
            return;
        }
        setVerifying(true);
        try {
            await axios.post("http://localhost:5000/api/otp/send", { email, phone });
            setOtpSent(true);
            alert('OTP generated successfully');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to send OTP');
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyOTP = async () => {
        setVerifying(true);
        try {
            const res = await axios.post("http://localhost:5000/api/otp/verify", { otp: emailOtp });
            // Since the requested backend returns success on valid OTP
            if (res.data.message === "OTP verified successfully") {
                setIsVerified(true);
                alert('Verification successful! You can now proceed to pay.');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert('Please verify your Email and Phone first.');
            return;
        }
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }
        setLoading(true);

        try {
            // 1. Process Payment
            const paymentRes = await API.post('/payment/process', {
                amount: bookingData.totalAmount,
                method: paymentMethod,
                details: paymentMethod === 'upi' ? { upiId: '8431186585@nyes' } : paymentMethod === 'card' ? { last4: cardDetails.number.slice(-4) } : {}
            });

            if (paymentRes.data.success) {
                const bookingPayload = {
                    showTime: bookingData.showTime || bookingData.showId || "any",
                    movieId: bookingData.movieId,
                    movieTitle: bookingData.movieTitle || "Movie",
                    moviePoster: bookingData.moviePoster || "",
                    movieLanguage: bookingData.movieLanguage || "en",
                    seats: bookingData.seats,
                    totalAmount: bookingData.totalAmount,
                    paymentMethod,
                    refreshments: bookingData.refreshments || [],
                    email,
                    phoneNumber: phone
                };

                const bookingRes = await API.post('/bookings', bookingPayload);
                sessionStorage.removeItem('pendingBooking');
                navigate('/booking-confirmation', { state: { booking: bookingRes.data.booking || bookingRes.data } });
            }
        } catch (error) {
            console.error("PAYMENT.JS: ERROR:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Payment or Booking Failed!");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', outline: 'none', boxSizing: 'border-box' };

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '40px 20px', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

                {/* PAYMENT METHODS */}
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Payment</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {['card', 'upi', 'cash'].map(opt => (
                            <div key={opt}
                                onClick={() => setPaymentMethod(opt)}
                                style={{
                                    padding: '20px', borderRadius: '12px', background: paymentMethod === opt ? 'rgba(229, 9, 20, 0.1)' : theme.panelBg,
                                    border: `1px solid ${paymentMethod === opt ? theme.accent : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer',
                                    transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px'
                                }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === opt ? theme.accent : '#555'}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {paymentMethod === opt && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: theme.accent }}></div>}
                                </div>
                                <span style={{ fontSize: '1.2rem', textTransform: 'uppercase' }}>{opt === 'cash' ? 'Cash at Counter' : opt}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PAYMENT DETAILS FORM */}
                <div style={{ background: theme.panelBg, padding: '30px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Contact Details</h3>

                    {!otpSent ? (
                        <>
                            <input style={inputStyle} type="email" placeholder="Email ID" value={email} onChange={e => setEmail(e.target.value)} disabled={isVerified} />
                            <input style={inputStyle} type="text" placeholder="Phone Number" maxLength="10" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} disabled={isVerified} />
                            {!isVerified && (
                                <button type="button" onClick={handleSendOTP} disabled={verifying} style={{ width: '100%', padding: '10px', marginBottom: '20px', background: 'transparent', border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: '8px', cursor: 'pointer' }}>
                                    {verifying ? 'Sending...' : 'Send OTP'}
                                </button>
                            )}
                        </>
                    ) : !isVerified ? (
                        <>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input style={inputStyle} type="text" placeholder="Email OTP" maxLength="6" value={emailOtp} onChange={e => setEmailOtp(e.target.value)} />
                                <input style={inputStyle} type="text" placeholder="Phone OTP" maxLength="6" value={phoneOtp} onChange={e => setPhoneOtp(e.target.value)} />
                            </div>
                            <button type="button" onClick={handleVerifyOTP} disabled={verifying} style={{ width: '100%', padding: '10px', marginBottom: '20px', background: theme.accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                {verifying ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <p style={{ textAlign: 'center', color: '#888', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setOtpSent(false)}>Change Details?</p>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#00c853', marginBottom: '20px', padding: '10px', background: 'rgba(0, 200, 83, 0.1)', borderRadius: '8px' }}>
                            ✓ Verified: {email}
                        </div>
                    )}

                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Order Summary</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Seats ({bookingData.seats?.length || 0})</span>
                        <span>₹{bookingData.seatTotal || (bookingData.seats?.length * 250)}</span>
                    </div>
                    {bookingData.refreshments?.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Refreshments</span>
                            <span>₹{bookingData.refreshmentTotal}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Total Payable</span>
                        <span>₹{bookingData.totalAmount}</span>
                    </div>

                    <form onSubmit={handlePayment}>
                        {paymentMethod === 'card' && (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <input style={inputStyle} type="text" placeholder="Cardholder Name" required value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })} />
                                <input style={inputStyle} type="text" placeholder="Card Number" required maxLength="16" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })} />
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <input style={inputStyle} type="text" placeholder="MM/YY" required value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                                    <input style={inputStyle} type="text" placeholder="CVV" required maxLength="3" value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'upi' && (
                            <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                                <div style={{ background: '#fff', padding: '15px', display: 'inline-block', borderRadius: '12px', marginBottom: '15px' }}>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=8431186585@nyes&pn=MovieBook&am=${bookingData.totalAmount}&cu=INR`)}`}
                                        alt="UPI QR Code"
                                        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                    />
                                </div>
                                <h3 style={{ margin: '10px 0', fontSize: '1.4rem' }}>₹{bookingData.totalAmount}</h3>
                                <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '20px' }}>
                                    UPI ID: <span style={{ color: '#fff', fontWeight: 'bold' }}>8431186585@nyes</span>
                                </p>
                            </div>
                        )}

                        {paymentMethod === 'cash' && (
                            <div style={{ animation: 'fadeIn 0.5s', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                                <p style={{ fontSize: '1.1rem', color: '#ccc' }}>Pay ₹{bookingData.totalAmount} at the counter before the show starts to confirm your tickets.</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading || !isVerified} style={{ width: '100%', padding: '15px', marginTop: '20px', background: isVerified ? theme.accent : '#333', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: isVerified ? 'pointer' : 'not-allowed', transition: 'background 0.3s' }}>
                            {loading ? 'Processing...' : !isVerified ? 'Verify Email/Phone First' : `Pay ₹${bookingData.totalAmount}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
