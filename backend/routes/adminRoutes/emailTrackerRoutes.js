const express = require("express");
const router = express.Router();
const Client = require("../../models/client");
const EmailLog = require("../../models/emailLog");

// Helper to calc days difference
const daysBetween = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const ACTIVE_MILESTONES = [90, 180, 270];
const RENEWAL_MILESTONES = [335, 365];

//this is the real time tracker that shows whats about to be send tomorroww
router.get("/email-tracker", async (req, res) => {
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const clients = await Client.find({
            subscriptionDate: { $ne: null },
            subscriptionStatus: { $in: ["Active", "Up for Renewal"] },
        });

        const tracker = clients
            .map((client) => {
                const { subscriptionDate, fullName, email, subscriptionStatus, milestoneEmailBlocked } = client;
                if (!subscriptionDate) return null;

                const daysSince = daysBetween(subscriptionDate, tomorrow);

                let milestone = null;
                if (
                    subscriptionStatus === "Active" &&
                    ACTIVE_MILESTONES.includes(daysSince)
                ) {
                    milestone = daysSince;
                }
                if (
                    subscriptionStatus === "Up for Renewal" &&
                    RENEWAL_MILESTONES.includes(daysSince)
                ) {
                    milestone = daysSince;
                }

                if (!milestone) return null;

                const sendDate = new Date(subscriptionDate);
                sendDate.setDate(sendDate.getDate() + milestone);

                return {
                    clientName: fullName,
                    email,
                    milestone,
                    sendDate,
                    blocked: milestoneEmailBlocked?.includes(milestone) || false, // ← mark if blocked
                };
            })
            .filter(Boolean);


        res.json(tracker);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



// history of all the milestone emails sent
router.get("/email-history", async (req, res) => {
    try {
        // Get page & limit from query (with defaults)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Total count (needed for pagination UI)
        const totalCount = await EmailLog.countDocuments();

        // Fetch only required records
        const logs = await EmailLog.find()
            .sort({ createdAt: -1 })  // latest first
            .skip(skip)
            .limit(limit);

        res.json({
            data: logs,
            totalCount,     // total rows in DB
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (err) {
        console.error("Error fetching email history:", err);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = {
    emailTrackerRoutes: router,
};
