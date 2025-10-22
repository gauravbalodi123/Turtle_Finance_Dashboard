// const mongoose = require('mongoose');
// const Client = require('../../models/client');
// const sendMilestoneEmail = require('./sendQuaterlyEmails');

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("MongoDB connected for one-time milestone catch-up"))
//     .catch(err => console.log(err));

// // Helper: calculate days diff
// const daysBetween = (date1, date2) => {
//     const diffTime = Math.abs(date2 - date1);
//     return Math.floor(diffTime / (1000 * 60 * 60 * 24));
// };

// const milestoneDays = [90, 180, 270, 335, 365];
// const BATCH_SIZE = 10;

// (async function sendMissedMilestones() {
//     const today = new Date();
//     const todayStr = today.toDateString();

//     try {
//         // Fetch all clients with Active or Up for Renewal
//         const clients = await Client.find({
//             subscriptionDate: { $ne: null },
//             subscriptionStatus: { $in: ["Active", "Up for Renewal"] },
//         });

//         console.log(`Found ${clients.length} clients to process`);

//         // Process in batches of 10
//         for (let i = 0; i < clients.length; i += BATCH_SIZE) {
//             const batch = clients.slice(i, i + BATCH_SIZE);

//             await Promise.all(batch.map(async (client) => {
//                 const { subscriptionDate, fullName, salutation, email, subscriptionStatus, lastMilestoneSent } = client;
//                 if (!subscriptionDate || !email) return;

//                 const daysSince = daysBetween(subscriptionDate, today);
//                 const displayName = salutation || fullName || "there";

//                 // Find milestones that haven't been sent yet
//                 const pendingMilestones = milestoneDays.filter(d => !lastMilestoneSent || d > lastMilestoneSent);
//                 if (!pendingMilestones.length) return;

//                 // Find closest milestone to current daysSince
//                 const closest = pendingMilestones.reduce((prev, curr) =>
//                     Math.abs(curr - daysSince) < Math.abs(prev - daysSince) ? curr : prev
//                 );

//                 // Check if already sent today (safety)
//                 if (client.lastMilestoneDate && new Date(client.lastMilestoneDate).toDateString() === todayStr) return;

//                 // Send email
//                 console.log(`Sending milestone ${closest} email to ${email}`);
//                 await sendMilestoneEmail(displayName, email, closest);

//                 // Update milestone tracking
//                 client.lastMilestoneSent = closest;
//                 client.lastMilestoneDate = today;

//                 // Extra logic for 365-day milestone
//                 if (closest === 365) {
//                     if (client.clientType === "Indian") client.clientType = "Indian Renewal";
//                     else if (client.clientType === "NRI") client.clientType = "NRI Renewal";

//                     if (client.subscriptionStatus === "Up for Renewal") client.subscriptionStatus = "Prospect";
//                 }

//                 await client.save();
//             }));

//             console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
//         }

//         console.log("One-time milestone catch-up complete!");
//         process.exit(0);
//     } catch (err) {
//         console.error("Error in one-time milestone catch-up:", err);
//         process.exit(1);
//     }
// })();
