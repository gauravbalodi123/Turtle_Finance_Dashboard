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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // assuming there's a User model
            //required: true,
            unique: true,
        },
        advisorFullName: {
            type: String,
            required: true
        },
        salutation: {
            type: String,
            default: null,
        },
        advisorDomain: {
            type: [String],
            enum: [
                "Others",
                "Financial Planner",
                "Insurance Advisor",
                "Tax Advisor",
                "Legal Advisor",
                "Banking and Compliance Advisor",
                "Credit Card Advisor"
            ],
            default: ["Others"]
        },
        eventName: {
            type: [String],
            enum: [
                "Karma Conversation",
                "Kick-off Conversation",
                "Financial Planning Conversation with RIA Krishna Rath",
                "Financial Planning Conversation with RIA Robins Joseph",
                "Financial Planning Conversation with RIA Kashish",
                "Financial Planning Conversation with Anuj Paul",
                "Insurance Advisory Conversation with Anuj Paul",
                "Insurance Advisory Conversation with Rishabh",
                "Insurance Advisory Conversation with Shabad",
                "Tax Planning Conversation with CA Nikhil",
                "Tax Planning Conversation with CA Rahul Sharma",
                "Tax Planning Conversation with CA Aman",
                "Tax Planning Conversation with CA Priyal",
                "Tax Planning Conversation with CA Ankit",
                "Tax Planning Conversation with CA Raunak",
                "Tax Planning Conversation with CA Amarnath Ambati",
                "Tax Planning Conversation with CA Siddhant Agarwal",
                "Tax Planning Conversation with CA Sanyam Goel",
                "Will Drafting Conversation with Anunay",
                "Will Drafting Conversation with Arpit",
                "Will Drafting Conversation with Kunal",
                "Preliminary conversation on EPF with Kunal",
                "Estate Planning with Adv. Geetanjali",
                "Banking & Compliance Conversation with Shruti",
                "Financial Planning Conversation with Shruti",
                "Credit Card Advisory Conversation with Nishadh",
                "Credit Card Advisory Conversation with Rishabh",
                "Check In with Turtle",
                "Bitcoin Discussion with Varun",
                "Tax Planning Conversation with CA Ajay Vaswani",
                "ITR Filing | Kick-off Conversation",
                "First Conversation with Turtle",
                "Insurance Advisory Conversation with Rohit",
                "Credit Card Advisory Conversation with Prashant"
            ],
            default: []
        },
        countryCode: {
            type: String,
            maxLength: 4,
            default: null,
        },
        countryCode2: {
            type: String,
            maxLength: 4,
            default: null,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        phone2: {
            type: String,
            unique: true,
        },
        email: {
            type: [String],
            required: true,
            validate: {
                validator: function (emails) {
                    return emails.every(email =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)   // Validate each email
                    );
                },
                message: props => `${props.value} contains an invalid email!`
            }
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
        },
        qualification: {
            type: String,
            default: null
        },
        experience: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },
        credentials: {
            type: String
        },
        bio: {
            type: String,
            default: null,
        },
        profilePictureId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File",
            required: false,
        },
        linkedinProfile: {
            type: String,
            default: null,
            // validate: {
            //     validator: function (v) {
            //         return /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(v);
            //     },
            //     message: props => `${props.value} is not a valid LinkedIn URL!`
            // }
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Advisor", AdvisorSchema);
