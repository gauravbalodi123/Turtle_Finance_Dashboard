const cron = require("node-cron");
const Client = require("../../models/client");
const EmailLog = require("../../models/emailLog"); // ✅ import your log model
const sendMilestoneEmail = require("./sendQuaterlyEmails");

// Milestone constants
const ACTIVE_MILESTONES = [90, 180, 270];
const RENEWAL_MILESTONES = [335, 365];
const BATCH_SIZE = 5; // send 5 emails at a time

// Helper function to calculate difference in days
const daysBetween = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Cron job: runs every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
    console.log("Running milestone email cron job...");

    const today = new Date();
    const todayStr = today.toDateString();

    try {
        // Fetch only Active or Up for Renewal clients
        const clients = await Client.find({
            subscriptionDate: { $ne: null },
            subscriptionStatus: { $in: ["Active", "Up for Renewal"] },
        });

        console.log(`Found ${clients.length} clients to check milestones.`);

        // Process in batches
        for (let i = 0; i < clients.length; i += BATCH_SIZE) {
            const batch = clients.slice(i, i + BATCH_SIZE);

            await Promise.all(
                batch.map(async (client) => {
                    const {
                        subscriptionDate,
                        fullName,
                        salutation,
                        email,
                        subscriptionStatus,
                        lastMilestoneSent,
                        lastMilestoneDate,
                        milestoneEmailBlocked,
                    } = client;

                    if (!subscriptionDate || !email) return;

                    const daysSinceSubscription = daysBetween(subscriptionDate, today);
                    const displayName = salutation || fullName || "there";

                    let shouldSend = false;

                    if (
                        subscriptionStatus === "Active" &&
                        ACTIVE_MILESTONES.includes(daysSinceSubscription)
                    )
                        shouldSend = true;

                    if (
                        subscriptionStatus === "Up for Renewal" &&
                        RENEWAL_MILESTONES.includes(daysSinceSubscription)
                    )
                        shouldSend = true;

                    // ❌ Skip if this milestone is blocked for this client
                    if (shouldSend && milestoneEmailBlocked?.includes(daysSinceSubscription)) {
                        console.log(`Skipping milestone ${daysSinceSubscription} for ${fullName} (blocked)`);
                        return;
                    }

                    // Skip if already sent today
                    if (
                        shouldSend &&
                        lastMilestoneSent === daysSinceSubscription &&
                        lastMilestoneDate &&
                        new Date(lastMilestoneDate).toDateString() === todayStr
                    )
                        return;

                    if (shouldSend) {
                        console.log(
                            `Sending milestone ${daysSinceSubscription} email to ${email}`
                        );

                        const plannedSendDate = new Date(subscriptionDate);
                        plannedSendDate.setDate(
                            plannedSendDate.getDate() + daysSinceSubscription
                        );

                        try {
                            await sendMilestoneEmail(
                                displayName,
                                email,
                                daysSinceSubscription
                            );

                            // ✅ Save successful log
                            await EmailLog.create({
                                clientName: fullName,
                                email: Array.isArray(email) ? email[0] : email,
                                milestone: daysSinceSubscription,
                                sendDate: plannedSendDate,
                                status: "Sent",
                            });

                            // Update client record
                            client.lastMilestoneSent = daysSinceSubscription;
                            client.lastMilestoneDate = today;

                            // Special 365-day logic
                            if (daysSinceSubscription === 365) {
                                if (client.clientType === "Indian")
                                    client.clientType = "Indian Renewal";
                                else if (client.clientType === "NRI")
                                    client.clientType = "NRI Renewal";

                                if (client.subscriptionStatus === "Up for Renewal")
                                    client.subscriptionStatus = "Prospect";
                            }

                            await client.save();
                        } catch (err) {
                            console.error(
                                `Failed to send milestone email to ${email}:`,
                                err
                            );

                            // ❌ Save failed log
                            await EmailLog.create({
                                clientName: fullName,
                                email: Array.isArray(email) ? email[0] : email,
                                milestone: daysSinceSubscription,
                                sendDate: plannedSendDate,
                                status: "Failed",
                            });
                        }
                    }
                })
            );
        }

        console.log("Milestone email cron job completed.");
    } catch (err) {
        console.error("Error in milestone email cron job:", err);
    }
});
