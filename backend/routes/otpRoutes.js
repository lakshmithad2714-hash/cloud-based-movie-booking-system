const express = require("express");
const router = express.Router();

// Simple test route to check connectivity
router.get("/test", (req, res) => {
    console.warn("OTP TEST ROUTE HIT");
    res.json({ message: "OTP routing is working!" });
});

router.post("/send", (req, res) => {
    try {
        const { email, phone } = req.body;

        if (!email || !phone) {
            return res.status(400).json({
                message: "Email and phone required"
            });
        }

        // Generate random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        console.log("=================================");
        console.log("Generated OTP for:", email);
        console.log("OTP:", otp);
        console.log("=================================");

        global.otpData = {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        // DO NOT send OTP back to frontend
        return res.status(200).json({
            message: "OTP generated successfully"
        });

    } catch (error) {
        console.error("OTP Error:", error);
        return res.status(500).json({
            message: "Failed to send OTP"
        });
    }
});

router.post("/verify", (req, res) => {
    try {
        const { otp } = req.body;

        if (!global.otpData) {
            return res.status(400).json({
                message: "No OTP generated or already expired"
            });
        }

        const currentTime = Date.now();
        if (currentTime > global.otpData.expires) {
            global.otpData = null; // Clear expired OTP
            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        if (Number(otp) !== global.otpData.otp) {
            console.warn("Verification Failed: OTP mismatch");
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        console.warn("Verification Successful ✅");
        // Optional: clear OTP after successful verification
        // global.otpData = null; 

        return res.status(200).json({
            message: "OTP verified successfully"
        });
    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({
            message: "Verification failed"
        });
    }
});

module.exports = router;
