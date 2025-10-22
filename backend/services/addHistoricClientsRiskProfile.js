// bulkInsertRiskProfilesBulk.js
const mongoose = require("mongoose");
const Client = require("../models/client"); // update path
const RiskProfile = require("../models/riskProfile"); // update path

// Connect to DB
const MONGO_URI = "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster"; // change this

// Import your risk profile JSON array
const riskProfilesData = require("../webhooks/Risk_Profiling.json"); // your JSON file with 100+ profiles

async function insertRiskProfilesBulk() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");

        const profilesToInsert = [];
        const matchedEmails = [];
        const failedEmails = [];

        for (const profile of riskProfilesData) {
            if (!profile.emailAddress) {
                failedEmails.push("(No email in profile)");
                continue;
            }

            // 1. Find the client by email
            const client = await Client.findOne({ email: profile.emailAddress });
            if (!client) {
                failedEmails.push(profile.emailAddress);
                continue;
            }

            // 2. Assign userId and clientId
            profile.userId = client.userId;
            profile.clientId = client._id;

            // 3. Convert timestamps to Date objects
            if (profile.submittedAt) profile.submittedAt = new Date(profile.submittedAt);
            if (profile.dateOfBirth) profile.dateOfBirth = new Date(profile.dateOfBirth);

            profilesToInsert.push(profile);
            matchedEmails.push(profile.emailAddress);
        }

        console.log(`\nMatched Profiles: ${matchedEmails.length}`);
        if (matchedEmails.length > 0) console.log("Emails matched:", matchedEmails);

        console.log(`\nFailed Profiles: ${failedEmails.length}`);
        if (failedEmails.length > 0) console.log("Emails failed (no client found):", failedEmails);

        if (profilesToInsert.length === 0) {
            console.log("No valid profiles to insert. Exiting.");
            mongoose.disconnect();
            return;
        }

        // 4. Bulk insert
        const result = await RiskProfile.insertMany(profilesToInsert, { ordered: false });
        console.log(`\n✅ Bulk insert completed. Total inserted: ${result.length}`);

        mongoose.disconnect();
    } catch (err) {
        console.error("Error inserting risk profiles:", err);
        mongoose.disconnect();
    }
}

insertRiskProfilesBulk();
