
const mongoose = require("mongoose");
const User = require("../models/user");     // adjust path if needed
const Advisor = require("../models/advisor"); // adjust path if needed

// Mongo connection
const MONGO_URI = "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster";
const DRY_RUN = false; // set to false to actually create users

// Connect DB
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
}

// Main Sync Function
async function syncAdvisorsToUsers() {
    try {
        const advisors = await Advisor.find();
        console.log(`Found ${advisors.length} advisors in DB`);

        const missingUsers = [];

        for (let advisor of advisors) {
            // Advisors may have multiple emails; take first valid one
            const email = Array.isArray(advisor.email) ? advisor.email[0] : advisor.email;
            if (!email) {
                console.warn(`⚠️ Advisor ${advisor.advisorFullName} has no email. Skipping.`);
                continue;
            }

            // Check if a user already exists with this email
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                missingUsers.push({
                    name: advisor.advisorFullName,
                    email,
                    phone: advisor.phone || "N/A",
                    advisorId: advisor._id
                });

                if (!DRY_RUN) {
                    // Create user with a default password "1234"
                    const newUser = await User.create({
                        name: advisor.advisorFullName,
                        email,
                        password: "1234", // assuming pre-save hook hashes it
                        role: "advisor",
                        phone: advisor.phone || "",
                    });

                    // Link this new user to advisor
                    advisor.userId = newUser._id;
                    await advisor.save();

                    console.log(`✅ Linked advisor "${advisor.advisorFullName}" to new user: ${email}`);
                }
            } else {
                // If user exists but advisor not linked, link them
                if (!advisor.userId) {
                    advisor.userId = existingUser._id;
                    if (!DRY_RUN) await advisor.save();
                    console.log(`🔗 Linked existing user (${email}) to advisor "${advisor.advisorFullName}"`);
                }
            }
        }

        if (DRY_RUN) {
            console.log("\n=== 🧾 DRY RUN REPORT ===");
            console.log(`Total new users that would be created: ${missingUsers.length}`);
            console.table(missingUsers.map(u => ({
                Name: u.name,
                Email: u.email,
                Phone: u.phone
            })));
            console.log("==========================\n");
        } else {
            console.log("🎯 Sync complete — Users created and advisors linked successfully");
        }

    } catch (err) {
        console.error("❌ Error syncing advisors:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 MongoDB disconnected");
    }
}

// Run
(async () => {
    await connectDB();
    await syncAdvisorsToUsers();
})();
