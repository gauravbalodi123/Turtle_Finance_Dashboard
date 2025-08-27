const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        //  required: true
    },
    amount: {
        type: Number,
        // required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        //required: true // e.g., 'credit_card', 'upi', 'bank_transfer'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, { timestamps: true }); // adds createdAt and updatedAt fields

module.exports = mongoose.model('Payment', PaymentSchema);
