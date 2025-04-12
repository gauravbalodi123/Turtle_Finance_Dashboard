const mongoose = require("mongoose");
const Client = require("./models/client.js");
const {fetchDatabaseData} = require('./datafromNotion/turtleClients.js')

const dummyClients =[

    {
        "fullName": "William Turner",
        "salutation": "Mr.",
        "leadSourceId": "44123",
        "leadSource": "Google Ads",
        "subscriptionStatus": "Expired",
        "gender": "Male",
        "countryCode": "+39",
        "phone": "2211334455",
        "email": "william.turner@example.com",
        "address": "78 Via Roma, Rome, Italy",
        "subscriptionDate": "2022-07-25",
        "onboardingStatus": "Kick Off Done",
        "riskProfileDate": "2022-08-05",
        "kickOffDate": "2022-08-15",
        "dob": "1977-11-29",
        "companyName": "Turner Solutions",
        "subscriptionDue": "2023-07-25"
    }

]  



async function seedClientDB() {
    const clientSeed = await fetchDatabaseData("95a2d0f29c6844e9bab0b563496e2752");
    try {
        await Client.deleteMany({});
        await Client.insertMany(clientSeed);
        console.log("✅ Client dummy data seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding client data:", error);
    }
}

module.exports = { seedClientDB };
