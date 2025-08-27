// models/SubscriptionPlan.js
const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        enum: ['Indian', 'NRI', 'Indian Renewal', 'NRI Renewal'],
        required: true,
        unique: true,
    },
    priceRupees: {
        type: String,
        required: true,
        min: 0,
    },
    priceDollar: {
        type: String,
        // required: true,
        min: 0,
    },

},
    { timestamps: true });


module.exports = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);