const mongoose = require("mongoose");
const RowwiseTask = require("../models/rowwisetask"); // adjust path if needed

async function markTasksCompleted() {
  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(
      "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db"
    );

    // 2. Define cutoff date
    const cutoffDate = new Date("2025-06-30T00:00:00.000Z");

    // 3. Run update
    const result = await RowwiseTask.updateMany(
      { dueDate: { $lt: cutoffDate } },
      { $set: { status: "Completed" } }
    );

    console.log(`${result.modifiedCount} tasks updated to Completed`);
  } catch (err) {
    console.error("Error updating tasks:", err);
  } finally {
    // 4. Close connection
    await mongoose.disconnect();
  }
}

markTasksCompleted();
