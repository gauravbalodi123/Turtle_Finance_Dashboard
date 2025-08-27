//Insurance Model
const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },

    policy_holder_1: { type: String, required: false },
    type_of_policy_1: { type: String, required: false },
    name_of_policy_1: { type: String, required: false },
    date_of_commencement_1: { type: String, required: false },  // Use Date if necessary
    sum_assured_1: { type: Number, required: false },
    term_1: { type: Number, required: false },
    premium_payment_term_1: { type: Number, required: false },
    annual_premium_1: { type: Number, required: false },
    year_of_maturity_1: { type: Number, required: false },

    policy_holder_2: { type: String, required: false },
    type_of_policy_2: { type: String, required: false },
    name_of_policy_2: { type: String, required: false },
    date_of_commencement_2: { type: String, required: false },  // Use Date if necessary
    sum_assured_2: { type: Number, required: false },
    term_2: { type: Number, required: false },
    premium_payment_term_2: { type: Number, required: false },
    annual_premium_2: { type: Number, required: false },
    year_of_maturity_2: { type: Number, required: false },

    policy_holder_3: { type: String, required: false },
    type_of_policy_3: { type: String, required: false },
    name_of_policy_3: { type: String, required: false },
    date_of_commencement_3: { type: String, required: false },  // Use Date if necessary
    sum_assured_3: { type: Number, required: false },
    term_3: { type: Number, required: false },
    premium_payment_term_3: { type: Number, required: false },
    annual_premium_3: { type: Number, required: false },
    year_of_maturity_3: { type: Number, required: false },

    company_name: { type: String, required: false },
    plan_name: { type: String, required: false },
    cover_amount: { type: Number, required: false },


    // File References
    life_insurance_policy_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: false,
    },
    health_insurance_policy_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: false,
    },
    additional_documents_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: false,
    },
});

const insuranceForm = mongoose.model('insuranceForm', insuranceSchema);

module.exports = insuranceForm;
