const cron = require("node-cron");
const Client = require("../../models/client");


// Helper: calculate days diff
const daysBetween = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Cron job: runs every day at 6 AM
cron.schedule("0 6 * * *", async () => {
    console.log("Running subscription status update job...");

    const today = new Date();

    try {
        // Exclude Expired + Deadpool
        const clients = await Client.find({
            subscriptionDate: { $ne: null },
            subscriptionStatus: { $nin: ["Expired", "Deadpool"] },
        });

        for (const client of clients) {
            const { subscriptionDate, subscriptionStatus } = client;
            if (!subscriptionDate) continue;

            const daysSince = daysBetween(subscriptionDate, today);

            // Flip only if between 305 and 364
            if (daysSince >= 305 && daysSince < 365 && subscriptionStatus === "Active") {
                client.subscriptionStatus = "Up for Renewal";
                await client.save();
                console.log(`Updated ${client.email} → Up for Renewal`);
            }
        }
    } catch (err) {
        console.error("Error in subscription status update job:", err);
    }
});
