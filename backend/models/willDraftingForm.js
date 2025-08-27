//Will schema

const mongoose = require('mongoose');

const willDraftingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    // Witnesses
    witness1_name: { type: String, default: '' },
    witness1_age: { type: String, default: '' },
    witness1_relation: { type: String, default: '' },
    witness2_name: { type: String, default: '' },
    witness2_age: { type: String, default: '' },
    witness2_relation: { type: String, default: '' },

    // Executors
    executor_main_name: { type: String, default: '' },
    executor_main_relation: { type: String, default: '' },
    executor_main_qualification: { type: String, default: '' },
    executor_backup_name: { type: String, default: '' },
    executor_backup_relation: { type: String, default: '' },
    executor_backup_qualification: { type: String, default: '' },

    // Beneficiaries
    beneficiary1: { type: String, default: '' },
    beneficiary1_relation: { type: String, default: '' },
    beneficiary1_benefit: { type: String, default: '' },

    beneficiary2: { type: String, default: '' },
    beneficiary2_relation: { type: String, default: '' },
    beneficiary2_benefit: { type: String, default: '' },

    beneficiary3: { type: String, default: '' },
    beneficiary3_relation: { type: String, default: '' },
    beneficiary3_benefit: { type: String, default: '' },

    beneficiary4: { type: String, default: '' },
    beneficiary4_relation: { type: String, default: '' },
    beneficiary4_benefit: { type: String, default: '' },

    // Assets
    asset1_type: { type: String, default: '' },
    asset1_account: { type: String, default: '' },
    asset1_description: { type: String, default: '' },

    asset2_type: { type: String, default: '' },
    asset2_account: { type: String, default: '' },
    asset2_description: { type: String, default: '' },

    asset3_type: { type: String, default: '' },
    asset3_account: { type: String, default: '' },
    asset3_description: { type: String, default: '' },

    asset4_type: { type: String, default: '' },
    asset4_account: { type: String, default: '' },
    asset4_description: { type: String, default: '' },

    asset5_type: { type: String, default: '' },
    asset5_account: { type: String, default: '' },
    asset5_description: { type: String, default: '' },

    asset6_type: { type: String, default: '' },
    asset6_account: { type: String, default: '' },
    asset6_description: { type: String, default: '' },

    asset7_type: { type: String, default: '' },
    asset7_account: { type: String, default: '' },
    asset7_description: { type: String, default: '' },

    asset8_type: { type: String, default: '' },
    asset8_account: { type: String, default: '' },
    asset8_description: { type: String, default: '' },

    additional_documents_file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
});



module.exports = mongoose.model('willDraftingForm', willDraftingSchema);
