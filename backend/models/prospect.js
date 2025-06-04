const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProspectSchema = new mongoose.Schema(
    {
        prospectId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },
        prospectName: {
            type: String,
            required: true,
        },
        prospectEmail: {
            type: String,
            required: true,
            unique: true,
        },
        advisorName: {
            type: String,
            default: null,
        },
        advisorEmail: {
            type: String,
            default: null,
        },
        countryCode: {
            type: String,
            maxlength: 4,
            required: true,
            default: null,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        bookingDate: {
            type: Date,
            required: true,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Prospect", ProspectSchema);
