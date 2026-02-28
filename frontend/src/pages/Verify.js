import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Verify = () => {
    const { user, token } = useAuth();
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (user?.isEmailVerified && user?.isPhoneVerified) {
            navigate('/');
        }
        // Pre-fill fields once user data is available
        if (user) {
            setEmail(user.email || '');
            setPhone(user.phone || '');
        }
    }, [user, token, navigate]);

    const validateInputs = () => {
        if (!email.endsWith('@gmail.com')) {
            setError('Please use a valid @gmail.com email address.');
            return false;
        }
        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            setError('Phone number must be exactly 10 digits.');
            return false;
        }
        return true;
    };

    const handleGenerateOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validateInputs()) return;

        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/otp/send", { email, phone });

            setMessage('OTP generated successfully');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTPs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/otp/verify", { otp: emailOtp });
            // For simplicity, we are verifying both with the same OTP logic as requested
            // If the user meant separate OTPs, the logic would be different, but I'll stick to the provided step.

            const storedUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...storedUser, isEmailVerified: true, isPhoneVerified: true }));

            // Check if this verification was triggered after a payment
            const { finalStep, bookingPayload } = location.state || {};

            if (finalStep && bookingPayload) {
                setMessage('Verification successful! Finalizing your booking...');
                const bookingRes = await API.post('/bookings', bookingPayload);
                sessionStorage.removeItem('pendingBooking');
                navigate('/booking-confirmation', { state: { booking: bookingRes.data.booking || bookingRes.data } });
            } else {
                setMessage('Verification successful! Redirecting...');
                setTimeout(() => navigate('/payment', { state: location.state }), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Please check your OTPs.');
        } finally {
            setLoading(false);
        }
    };

    const theme = { bg: '#0b0c10', text: '#f5f5f5', accent: '#e50914', panelBg: 'rgba(255,255,255,0.05)' };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        marginBottom: '15px',
        borderRadius: '10px',
        border: '1.5px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.06)',
        color: '#fff',
        outline: 'none',
        boxSizing: 'border-box',
        fontSize: '0.95rem'
    };

    const otpInputStyle = {
        ...inputStyle,
        textAlign: 'center',
        letterSpacing: '5px',
        fontSize: '1.1rem'
    };

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '480px', width: '100%', background: theme.panelBg, padding: '40px', borderRadius: '20px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px', textAlign: 'center' }}>Verify Identity</h2>
                <p style={{ color: '#a0a0b0', textAlign: 'center', marginBottom: '30px' }}>
                    {step === 1 ? 'Step 1: Confirm your contact details' : 'Step 2: Enter the OTPs sent to you'}
                </p>

                {error && <div style={{ background: 'rgba(229, 9, 20, 0.1)', color: '#ff4d4d', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid rgba(229, 9, 20, 0.2)' }}>{error}</div>}
                {message && <div style={{ background: 'rgba(0, 200, 83, 0.1)', color: '#00c853', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid rgba(0, 200, 83, 0.2)' }}>{message}</div>}

                {location.state?.bookingPayload && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Verifying booking for:</p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{location.state.bookingPayload.movieTitle}</p>
                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Seats: {location.state.bookingPayload.seats.join(', ')} • Amount: ₹{location.state.bookingPayload.totalAmount}</p>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleGenerateOTP}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#a0a0b0' }}>Email Address (@gmail.com)</label>
                            <input
                                style={inputStyle}
                                type="email"
                                placeholder="example@gmail.com"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#a0a0b0' }}>Phone Number (10 Digits)</label>
                            <input
                                style={inputStyle}
                                type="text"
                                maxLength="10"
                                placeholder="9876543210"
                                required
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '14px', marginTop: '20px', fontSize: '1.1rem' }}
                        >
                            {loading ? 'Sending...' : 'Generate OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#a0a0b0' }}>Email OTP</label>
                                <input
                                    style={otpInputStyle}
                                    type="text"
                                    maxLength="6"
                                    placeholder="000000"
                                    required
                                    value={emailOtp}
                                    onChange={e => setEmailOtp(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#a0a0b0' }}>Phone OTP</label>
                                <input
                                    style={otpInputStyle}
                                    type="text"
                                    maxLength="6"
                                    placeholder="000000"
                                    required
                                    value={phoneOtp}
                                    onChange={e => setPhoneOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '14px', marginTop: '20px', fontSize: '1.1rem' }}
                        >
                            {loading ? 'Verifying...' : 'Verify Now'}
                        </button>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{ background: 'none', border: 'none', color: '#a0a0b0', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                            >
                                Change Details?
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Verify;
