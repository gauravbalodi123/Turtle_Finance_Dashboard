const mongoose = require("mongoose");
const Prospect = require("./models/prospect");

const dummyProspects = [
    {
        prospectName: "Alice Johnson",
        prospectEmail: "alice.johnson@example.com",
        advisorName: "John Advisor",
        advisorEmail: "john.advisor@example.com",
        countryCode: "+91",
        phone: "9876543210",
        bookingDate: "2025-05-25"
    },
    {
        prospectName: "Bob Smith",
        prospectEmail: "bob.smith@example.com",
        advisorName: "Mary Guide",
        advisorEmail: "mary.guide@example.com",
        countryCode: "+1",
        phone: "1234567890",
        bookingDate: "2025-05-26"
    },
    {
        prospectName: "Charlie Adams",
        prospectEmail: "charlie.adams@example.com",
        advisorName: "Nina Patel",
        advisorEmail: "nina.patel@example.com",
        countryCode: "+44",
        phone: "7712345678",
        bookingDate: "2025-06-01"
    },
    {
        prospectName: "Diana Lee",
        prospectEmail: "diana.lee@example.com",
        advisorName: "Kevin Zhang",
        advisorEmail: "kevin.zhang@example.com",
        countryCode: "+65",
        phone: "81234567",
        bookingDate: "2025-06-03"
    },
    {
        prospectName: "Ethan Walker",
        prospectEmail: "ethan.walker@example.com",
        advisorName: "Priya Kapoor",
        advisorEmail: "priya.kapoor@example.com",
        countryCode: "+61",
        phone: "412345678",
        bookingDate: "2025-06-05"
    },
    {
        prospectName: "Fatima Khan",
        prospectEmail: "fatima.khan@example.com",
        advisorName: "Tom Hughes",
        advisorEmail: "tom.hughes@example.com",
        countryCode: "+971",
        phone: "501234567",
        bookingDate: "2025-06-07"
    },
    {
        prospectName: "George Kim",
        prospectEmail: "george.kim@example.com",
        advisorName: "Linda Gomez",
        advisorEmail: "linda.gomez@example.com",
        countryCode: "+82",
        phone: "1023456789",
        bookingDate: "2025-06-10"
    }
];


async function seedProspectDB() {
    try {
        await Prospect.deleteMany({});
        await Prospect.insertMany(dummyProspects);
        console.log("✅ Prospect data seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding prospect data:", error);
    }
}

module.exports = { seedProspectDB };
