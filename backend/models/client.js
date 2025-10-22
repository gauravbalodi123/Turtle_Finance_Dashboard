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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // assuming there's a User model
            //required: true,
            unique: true,
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
            enum: ["Active", "Expired", "Prospect", "Up for Renewal", "Deadpool"],
            default: "Prospect",
        },
        // caseType: {
        //     type: String,
        //     enum: ["NRI", "Resident Indian"],
        //     default: null,
        // },
        clientType: {
            type: String,
            enum: ["Indian", "NRI", 'Indian Renewal', 'NRI Renewal'],
            //default: null,
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
        countryCode2: {
            type: String,
            maxlength: 4,
            default: null,
        },
        phone2: {
            type: String,
            unique: true,
            default: null,
        },
        email: {
            type: [String],
            required: true,
            validate: {
                validator: function (emails) {
                    return emails.every(email =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)   // validate each email
                    );
                },
                message: props => `${props.value} contains an invalid email!`
            }
        },
        address: {
            type: String,
            default: null,
        },
        subscriptionDate: {
            type: Date,
            default: null,
        },
        subscriptionDue: {
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
        advisors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Advisor",
            },
        ],
        bio: {
            type: String,
            default: null,

        },
        linkedinProfile: {
            type: String,
            default: null,
        },
        lastMilestoneSent: {
            type: Number,
            default: null,
        },
        lastMilestoneDate: {
            type: Date,
            default: null,
        },
        milestoneEmailBlocked: {
            type: [Number],
        },
    },
    { timestamps: true }
);



ClientSchema.pre("save", function (next) {
    if (this.subscriptionDate) {
        const dueDate = new Date(this.subscriptionDate);
        dueDate.setFullYear(dueDate.getFullYear() + 1);
        this.subscriptionDue = dueDate;
    }
    next();
});


ClientSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();

    if (update.subscriptionDate) {
        const dueDate = new Date(update.subscriptionDate);
        dueDate.setFullYear(dueDate.getFullYear() + 1);
        update.subscriptionDue = dueDate;
        this.setUpdate(update);
    }

    next();
});




module.exports = mongoose.model("Client", ClientSchema);
