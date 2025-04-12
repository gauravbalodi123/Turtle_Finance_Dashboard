const mongoose = require('mongoose');
const Advisor = require('./models/advisor')
const {fetchDatabaseDataAdvisors} = require('./datafromNotion/turtleAdvisors')



async function seedAdvisorDB() {
    const advisorSeed = await fetchDatabaseDataAdvisors("951f266835164926bc2d2b5d133cdc57");
    try {
        await Advisor.deleteMany({});
        await Advisor.insertMany(advisorSeed);
        console.log("✅ Advisor data seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding client data:", error);
    }
}


module.exports = {seedAdvisorDB};
















