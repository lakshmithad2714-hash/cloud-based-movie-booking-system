import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import axios from 'axios';
import { Mail, Phone, ShieldCheck, CreditCard, Smartphone, Banknote, ArrowLeft, CheckCircle } from 'lucide-react';

const Contact = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movieId, showTime, selectedSeats, refreshments, grandTotal, movie, seatTotal, refreshmentTotal } = location.state || {};

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

    if (!selectedSeats) {
        return (
            <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <h2>No booking data found.</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
            </div>
        );
    }

    const theme = { bg: '#0b0c10', text: '#fff', accent: '#e50914', panelBg: 'rgba(255,255,255,0.05)' };

    const handleSendOTP = async () => {
        if (!email.includes('@') || phone.length < 10) {
            alert('Please enter a valid email and phone number');
            return;
        }
        setVerifying(true);
        const url = "http://localhost:5000/api/otp/send";
        console.log("Attempting to send OTP to URL:", url);
        try {
            const res = await axios.post(url, { email, phone });
            console.log("OTP Response Successful:", res.data);
            setOtpSent(true);
            alert('OTP generated successfully');
        } catch (error) {
            console.error("FRONTEND OTP ERROR:", error);
            if (error.response) {
                console.error("Response Data:", error.response.data);
                console.error("Response Status:", error.response.status);
            } else if (error.request) {
                console.error("No response received from server. Check CORS or server status.");
            }
            alert('Failed to send OTP: ' + (error.response?.data?.message || error.message || 'Unknown Error'));
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            alert("Please enter OTP");
            return;
        }
        setVerifying(true);
        try {
            const res = await axios.post("http://localhost:5000/api/otp/verify", { otp });
            if (res.data.message === "OTP verified successfully") {
                setIsVerified(true);
                alert("OTP Verified Successfully ✅");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Verification failed ❌");
        } finally {
            setVerifying(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!isVerified) return alert('Please verify your Email and Phone first.');
        if (!paymentMethod) return alert('Please select a payment method.');
        setLoading(true);

        try {
            // Process Payment
            const paymentRes = await API.post('/payment/process', {
                amount: grandTotal,
                method: paymentMethod,
                details: paymentMethod === 'upi' ? { upiId: '8431186585@nyes' } : paymentMethod === 'card' ? { last4: cardDetails.number.slice(-4) } : {}
            });

            if (paymentRes.data.success) {
                const bookingPayload = {
                    showTime,
                    movieId,
                    movieTitle: movie?.title || "Movie",
                    moviePoster: movie?.poster_path || "",
                    movieLanguage: movie?.original_language || "en",
                    seats: selectedSeats,
                    totalPrice: grandTotal,
                    seatTotal,
                    refreshmentTotal,
                    grandTotal,
                    paymentMethod,
                    refreshments: refreshments || [],
                    email,
                    phoneNumber: phone
                };

                const bookingRes = await API.post('/bookings', bookingPayload);
                navigate('/booking-confirmation', { state: { booking: bookingRes.data.booking || bookingRes.data } });
            }
        } catch (error) {
            alert(error.response?.data?.error || "Booking Failed!");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', boxSizing: 'border-box' };

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Finalize <span className="highlight">Booking</span></h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>

                    {/* LEFT SECTION: AUTH & PAYMENT */}
                    <div style={{ background: theme.panelBg, padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ShieldCheck size={20} color={theme.accent} /> Contact Verification
                            </h3>

                            {!otpSent ? (
                                <>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#666' }} />
                                        <input style={{ ...inputStyle, paddingLeft: '45px' }} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} disabled={isVerified} />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#666' }} />
                                        <input style={{ ...inputStyle, paddingLeft: '45px' }} type="text" placeholder="Phone Number" maxLength="10" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} disabled={isVerified} />
                                    </div>
                                    {!isVerified && (
                                        <button type="button" onClick={handleSendOTP} disabled={verifying} className="btn btn-outline" style={{ width: '100%', padding: '12px', borderRadius: '10px' }}>
                                            {verifying ? 'Sending...' : 'Generate OTP'}
                                        </button>
                                    )}
                                </>
                            ) : !isVerified ? (
                                <>
                                    <div style={{ position: 'relative' }}>
                                        <input style={inputStyle} type="text" placeholder="Enter 6-digit OTP" maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} />
                                    </div>
                                    <button type="button" onClick={handleVerifyOTP} disabled={verifying} className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '10px' }}>
                                        {verifying ? 'Verifying...' : 'Verify Identity'}
                                    </button>
                                    <p style={{ textAlign: 'center', color: '#888', cursor: 'pointer', fontSize: '0.9rem', marginTop: '15px' }} onClick={() => setOtpSent(false)}>Change Details?</p>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#00c853', padding: '20px', background: 'rgba(0, 200, 83, 0.1)', borderRadius: '12px', border: '1px solid rgba(0,200,83,0.2)' }}>
                                    <CheckCircle size={30} style={{ marginBottom: '10px' }} />
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>Identity Verified</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>{email} • {phone}</p>
                                </div>
                            )}
                        </section>

                        <section>
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CreditCard size={20} color={theme.accent} /> Payment Method
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '25px' }}>
                                {[
                                    { id: 'card', name: 'Card', icon: <CreditCard size={18} /> },
                                    { id: 'upi', name: 'UPI', icon: <Smartphone size={18} /> },
                                    { id: 'cash', name: 'Cash', icon: <Banknote size={18} /> }
                                ].map(opt => (
                                    <div key={opt.id} onClick={() => setPaymentMethod(opt.id)} style={{
                                        padding: '15px 10px', borderRadius: '12px', background: paymentMethod === opt.id ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${paymentMethod === opt.id ? theme.accent : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.3s'
                                    }}>
                                        <div style={{ color: paymentMethod === opt.id ? theme.accent : '#888' }}>{opt.icon}</div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{opt.name}</span>
                                    </div>
                                ))}
                            </div>

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
                                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=8431186585@nyes&pn=MovieBook&am=${grandTotal}&cu=INR`)}`} alt="QR" style={{ borderRadius: '8px' }} />
                                    <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '10px' }}>Scan with any UPI app</p>
                                </div>
                            )}

                            {paymentMethod === 'cash' && (
                                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ margin: 0, color: '#ccc' }}>Pay at counter before the show.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT SECTION: SUMMARY */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '25px' }}>Your Ticket</h3>
                        <div style={{ marginBottom: '25px' }}>
                            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '5px' }}>Movie</p>
                            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{movie?.title}</h4>
                            <p style={{ color: '#aaa', margin: '5px 0' }}>{showTime} • {selectedSeats.length} Seats: {selectedSeats.join(', ')}</p>
                        </div>

                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '20px', marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#888' }}>Seats Total</span>
                                <span>₹{seatTotal}</span>
                            </div>

                            {refreshments?.length > 0 && (
                                <>
                                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '20px', marginBottom: '10px' }}>Refreshments</p>
                                    {refreshments.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                            <span>{r.name} x {r.quantity}</span>
                                            <span>₹{r.price * r.quantity}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#888' }}>
                                        <span>Refreshments Total</span>
                                        <span>₹{refreshmentTotal}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Grand Total</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: theme.accent }}>₹{grandTotal}</span>
                        </div>

                        <button onClick={handlePayment} disabled={loading || !isVerified || !paymentMethod} className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {loading ? 'Finalizing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
