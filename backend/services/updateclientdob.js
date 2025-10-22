const mongoose = require("mongoose");

// MongoDB connection URL
const MONGO_URI = "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster";

// Load Client model
const Client = require("../models/client"); // Adjust the path if needed

// Email -> DOB mapping (converted to YYYY-MM-DD format)
const emailDobList = [
    { email: "murali.medisetty@gmail.com", dob: "1989-07-24" },
    { email: "mthakur2792@gmail.com", dob: "1993-03-21" },
    { email: "rahul.fernandes@gmail.com", dob: "1981-11-19" },
    { email: "sidpanix@gmail.com", dob: "1985-05-05" },
    { email: "aayushsingh90@yahoo.com", dob: "1992-11-28" },
    { email: "onlineshripad@gmail.com", dob: "1983-11-16" },
    { email: "prasadreddych@hotmail.com", dob: "1986-07-30" },
    { email: "priyanka.ramanujam@gmail.com", dob: "1984-10-31" },
    { email: "engaksiit@gmail.com", dob: "1988-03-08" },
    { email: "kamlesh007i9@gmail.com", dob: "1992-09-09" },
    { email: "gchat1971@gmail.com", dob: "1983-01-29" },
    { email: "sourav.revo@gmail.com", dob: "1989-06-28" },
    { email: "kulkarniprathik@gmail.com", dob: "1993-12-21" },
    { email: "mehul_rad@yahoo.co.in", dob: "1981-10-23" },
    { email: "venueppala@icloud.com", dob: "1983-08-06" },
    { email: "sumanth.koushik@gmail.com", dob: "1990-09-05" },
    { email: "swapnil34@gmail.com", dob: "1985-06-09" },
    { email: "ashraymathur@gmail.com", dob: "1984-02-25" },
    { email: "hariteja.526@gmail.com", dob: "1993-05-26" },
    { email: "ps.sharma.111@gmail.com", dob: "1991-09-29" },
    { email: "kishorelr@gmail.com", dob: "1980-05-04" },
    { email: "inamdarshashank08@gmail.com", dob: "1982-12-08" },
    { email: "prasuj@gmail.com", dob: "1979-03-10" },
    { email: "madhvar@yahoo.com", dob: "1972-05-07" },
];

// Convert to Date object
function toDateObject(dateStr) {
    return new Date(dateStr + "T00:00:00Z");
}

async function updateDob() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");

        const bulkOps = emailDobList.map(item => ({
            updateOne: {
                filter: { email: { $in: [item.email] } }, // even if one matches in the email array
                update: { $set: { dob: toDateObject(item.dob) } }
            }
        }));

        const result = await Client.bulkWrite(bulkOps);
        console.log(`🎉 Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error updating DOBs:", err);
        mongoose.connection.close();
    }
}

updateDob();
