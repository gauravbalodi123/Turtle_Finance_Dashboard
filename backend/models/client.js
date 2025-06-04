const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ClientSchema = new mongoose.Schema(
    {
        clientId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        salutation: {
            type: String,
            default: null,
        },
        leadSourceId: {
            type: String,
            default: null,
        },
        leadSource: {
            type: String,
            default: null,
        },
        subscriptionStatus: {
            type: String,
            enum: ["Active", "Expired", "Up for Renewal"],
            default: null,
        },
        caseType: {
            type: String,
            enum: ["NRI", "Resident Indian"],
            default: null,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other", "Null"],
            default: null,
        },
        countryCode: {
            type: String,
            maxlength: 4,
            default: null,
        },
        phone: {
            type: String,
            unique: true,
            required: true,
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
        subscriptionDate: {
            type: Date,
            default: null,
        },
        onboardingStatus: {
            type: String,
            enum: [
                "Not Started",
                "RIA Allocated",
                "Payment Received",
                "Risk Profile Done",
                "Kick Off Done",
                "Contract Signed",
                "null"
            ],
            default: null,
        },
        riskProfileDate: {
            type: Date,
            default: null,
        },
        kickOffDate: {
            type: Date,
            default: null,
        },
        dob: {
            type: Date,
            default: null,
        },
        companyName: {
            type: String,
            default: null,
        },
        aua: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AuaData",
            default: null,
        },
        subscriptionDue: {
            type: Date,
            default: null,
        },
        riaData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RiaData",
            default: null,
        },
        taxDataId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaxData",
            default: null,
        },
        insuranceDataId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InsuranceData",
            default: null,
        },
        successionDataId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SuccessionData",
            default: null,
        },
        creditCardDataId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CreditCardData",
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
