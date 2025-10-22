const mongoose = require("mongoose");
const User = require("../models/user");    // adjust path
const Client = require("../models/client"); // adjust path

const MONGO_URI = "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster";
const DRY_RUN = false; // set to false to actually create users

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected ✅");
    } catch (err) {
        console.error("MongoDB connection failed ❌", err);
        process.exit(1);
    }
}

async function syncClientsToUsers() {
    try {
        const clients = await Client.find();
        console.log(`Found ${clients.length} clients`);

        const missingUsers = [];

        for (let client of clients) {
            const email = Array.isArray(client.email) ? client.email[0] : client.email;
            if (!email) continue;

            const user = await User.findOne({ email });
            if (!user) {
                missingUsers.push({
                    name: client.fullName,
                    email,
                    phone: client.phone || "N/A",
                    clientId: client._id
                });

                if (!DRY_RUN) {
                    // Create user with plain password "1234"
                    const newUser = await User.create({
                        name: client.fullName,
                        email,
                        password: "1234", // pre-save hook will hash this automatically
                        role: "client",
                        phone: client.phone || "",
                    });

                    // Link new user to client
                    client.userId = newUser._id;
                    await client.save();
                }
            }
        }

        if (DRY_RUN) {
            console.log("\n=== DRY RUN REPORT ===");
            console.log(`Total users to be created: ${missingUsers.length}`);
            console.table(missingUsers.map(u => ({ Name: u.name, Email: u.email, Phone: u.phone })));
            console.log("======================\n");
        } else {
            console.log("Users created and clients linked successfully ✅");
        }

    } catch (err) {
        console.error("Error syncing clients:", err);
    } finally {
        mongoose.disconnect();
    }
}

(async () => {
    await connectDB();
    await syncClientsToUsers();
})();
