// models/DigioResponse.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const DigioResponseSchema = new Schema({
    digio_doc_id: {
        type: String,
        // required: true,
        // unique: true
    },
    txn_id: {
        type: String,
        // required: true
    },
    message: {
        type: String,
        default: 'Signed Successfully'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assuming you have a User model
        // required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // assuming you have a Client model
        // required: true
    },
    timestamps: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DigioResponse', DigioResponseSchema);
