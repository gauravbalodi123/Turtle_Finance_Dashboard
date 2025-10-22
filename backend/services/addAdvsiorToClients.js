const mongoose = require('mongoose');
const Booking = require('../models/booking'); // adjust path as needed
const Client = require('../models/client');   // adjust path as needed

// 🧠 connect to MongoDB
const MONGO_URI = 'mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster'; // change this to your URI

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

(async () => {
    try {
        console.log("🚀 Starting advisor assignment script...");
        const bookings = await Booking.find({});
        console.log(`📊 Total bookings found: ${bookings.length}`);

        let updatedCount = 0;
        let skippedCount = 0;
        let processedCount = 0;

        for (const booking of bookings) {
            const inviteeEmail = booking?.invitee?.email?.trim()?.toLowerCase();
            const advisorIds = booking?.advisors || [];

            // skip if no email or no advisors
            if (!inviteeEmail || advisorIds.length === 0) {
                skippedCount++;
                processedCount++;
            } else {
                // find client by email (Client.email is an array)
                const client = await Client.findOne({ email: inviteeEmail });

                if (!client) {
                    skippedCount++;
                    processedCount++;
                } else {
                    // add advisors without duplicates
                    let changed = false;
                    advisorIds.forEach((advisorId) => {
                        if (!client.advisors.some(existingId => existingId.equals(advisorId))) {
                            client.advisors.push(advisorId);
                            changed = true;
                        }
                    });

                    if (changed) {
                        await client.save();
                        updatedCount++;
                        console.log(`✅ Updated client: ${client.fullName} (${inviteeEmail})`);
                    }

                    processedCount++;
                }
            }

            // 🧭 Log progress every 100 processed bookings
            if (processedCount % 100 === 0) {
                console.log(`📈 Progress: ${processedCount}/${bookings.length} processed | ✅ Updated: ${updatedCount} | ⏭️ Skipped: ${skippedCount}`);
            }
        }

        console.log("✨ Script completed.");
        console.log(`✅ Total Clients updated: ${updatedCount}`);
        console.log(`⏭️ Total Bookings skipped: ${skippedCount}`);
        console.log(`📊 Total Processed: ${processedCount}/${bookings.length}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error during execution:", err);
        process.exit(1);
    }
})();
