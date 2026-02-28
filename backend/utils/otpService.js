const nodemailer = require('nodemailer');
const axios = require('axios');

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends OTP via Email using Nodemailer
 * @param {string} email 
 * @param {string} otp 
 */
const sendEmailOTP = async (email, otp) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('WARNING: EMAIL_USER or EMAIL_PASS missing in .env');
            if (process.env.NODE_ENV === 'development') {
                console.log(`[DEV MODE] Skipping email send. OTP for ${email}: ${otp}`);
                return true;
            }
            throw new Error('Email credentials not configured');
        }

        await transporter.sendMail({
            from: `"MovieBook" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Movie Booking OTP',
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`
        });

        console.log(`Email OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error('CRITICAL: Email OTP Send Failure:', error);

        // Development Fallback
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            console.log(`[DEV MODE] Email failed but continuing. OTP for ${email}: ${otp}`);
            return true;
        }

        throw new Error('Failed to send Email OTP');
    }
};

/**
 * Sends OTP via SMS using Fast2SMS API
 * @param {string} phone 
 * @param {string} otp 
 */
const sendPhoneOTP = async (phone, otp) => {
    try {
        if (!process.env.SMS_API_KEY) {
            console.warn('WARNING: SMS_API_KEY missing in .env');
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                console.log(`[DEV MODE] Skipping SMS send. OTP for ${phone}: ${otp}`);
                return true;
            }
            throw new Error('SMS API Key not configured');
        }

        await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                variables_values: otp,
                route: "otp",
                numbers: phone
            },
            {
                headers: {
                    authorization: process.env.SMS_API_KEY
                }
            }
        );

        console.log(`Phone OTP sent to ${phone}`);
        return true;
    } catch (error) {
        console.error('CRITICAL: Phone OTP Send Failure:', error.response?.data || error.message);

        // Development Fallback
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            console.log(`[DEV MODE] SMS API failed but continuing. OTP for ${phone}: ${otp}`);
            return true;
        }

        throw new Error('Failed to send Phone OTP');
    }
};

module.exports = { sendEmailOTP, sendPhoneOTP };
