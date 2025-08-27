const mongoose = require("mongoose");
const Client = require("./models/client"); // Adjust the path
const Advisor = require("./models/advisor"); // Adjust the path
const RiskProfile = require("./models/riskProfile"); // Adjust the path as needed

async function dropPhoneIndex() {
  await mongoose.connect(""); // Change to your actual DB URI
 // await Advisor.collection.dropIndex("phone_1");
//   await RiskProfile.collection.dropIndex("userId_1");
 await Client.collection.dropIndex("phone");
  console.log("Dropped 'phone_1' index");
  process.exit();
}

dropPhoneIndex();