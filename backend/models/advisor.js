const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AdvisorSchema = new mongoose.Schema(
    {
        advisorId: {
            type: String,  
            default: uuidv4, 
            unique: true,
            required: true
        },
        advisorFullName: {
            type: String,
            required:true
        },
        salutation: { 
            type: String,
            default: null,
        },
        advisorDomain: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            maxLength: 4,
            default: null,
        },
        phone: {
            type: String, 
            required: true,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        address: {
            type: String,
            default: null,
        },
        dob: {
            type: Date,
            default: null,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: null,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Advisor", AdvisorSchema);
