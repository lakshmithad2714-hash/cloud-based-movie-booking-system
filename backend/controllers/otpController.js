exports.sendOTP = async (req, res) => {
    try {
        const { email, phone } = req.body;

        console.log("Incoming Data:", req.body);

        if (!email || !phone) {
            return res.status(400).json({
                message: "Email and phone required"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Generated OTP:", otp);

        global.otpData = {
            otp,
            email,
            phone,
            expires: Date.now() + 5 * 60 * 1000
        };

        return res.status(200).json({
            message: "OTP generated successfully"
        });

    } catch (error) {
        console.error("OTP Error:", error);
        return res.status(500).json({
            message: "Failed to send OTP"
        });
    }
};

exports.verifyOTP = (req, res) => {
    const { otp } = req.body;

    if (!global.otpData) {
        return res.status(400).json({ message: "No OTP generated" });
    }

    if (Date.now() > global.otpData.expires) {
        return res.status(400).json({ message: "OTP expired" });
    }

    if (otp !== global.otpData.otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });
};
