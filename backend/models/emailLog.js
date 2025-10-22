const mongoose = require("mongoose");

const EmailLogSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        milestone: {
            type: Number,
            required: true,
        },
        sendDate: {
            type: Date,   // when it's supposed to be sent
            required: true,
        },
        sentAt: {
            type: Date,   // when it was actually sent
            default: null,
        },
        status: {
            type: String,
            enum: ["Scheduled", "Sent", "Failed", "Cancelled"],
            default: "Scheduled",   // new emails start as Scheduled
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EmailLog", EmailLogSchema);
