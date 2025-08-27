// routes/admin.js or wherever your admin routes are
const express = require("express");
const router = express.Router();
const sendOnboardingEmail = require("../../utils/sendOnboardingDetails"); // path to utility

router.post("/sendOnboardingEmail", async (req, res) => {
    const {fullName, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }

    try {
        await sendOnboardingEmail(fullName ,email, password);
        res.status(200).json({ msg: "Email sent successfully" });
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ msg: "Failed to send email" });
    }
});


module.exports = {
    emailRoutes: router
}