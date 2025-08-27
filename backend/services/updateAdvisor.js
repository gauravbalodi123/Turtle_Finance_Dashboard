const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Advisor = require("../models/advisor");

// Replace with your actual MongoDB URI
const MONGO_URI = "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster";

async function enrichBookingsWithAdvisors() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    const batchSize = 500;
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const bookingsToUpdate = await Booking.find({
        $or: [
          { advisors: { $exists: false } },
          { advisors: { $size: 0 } }
        ]
      })
        .skip(skip)
        .limit(batchSize);

      if (bookingsToUpdate.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`🔍 Processing batch of ${bookingsToUpdate.length} bookings (skip: ${skip})`);

      for (const booking of bookingsToUpdate) {
        try {
          const guestEmails = (booking.event_guests || [])
            .map(g => g.email)
            .filter(Boolean);

          if (guestEmails.length === 0) {
            console.log(`⚠️ No guest emails in booking ${booking._id}`);
            continue;
          }

          const matchedAdvisors = await Advisor.find(
            { email: { $in: guestEmails } },
            "_id"
          );

          const advisorIds = matchedAdvisors.map(a => a._id);

          if (advisorIds.length > 0) {
            booking.advisors = advisorIds;
            await booking.save();
            console.log(`✅ Updated booking ${booking._id} with advisors:`, advisorIds);
          } else {
            console.log(`⚠️ No matching advisors for booking ${booking._id}`);
          }
        } catch (err) {
          console.error(`❌ Error processing booking ${booking._id}:`, err.message);
        }
      }

      skip += batchSize;
    }

    console.log("🎉 Finished enriching bookings.");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error connecting to MongoDB or processing:", err);
    mongoose.connection.close();
  }
}

enrichBookingsWithAdvisors();
