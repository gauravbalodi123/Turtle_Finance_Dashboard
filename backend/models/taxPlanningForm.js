//Tax Planning


const mongoose = require('mongoose');

const taxPlanningSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // assuming there's a Client model
    //required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming there's a User model
    //required: true,
    unique: true,
  },

  // Step 1: Salary Income Details
  basic_pay: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  other_allowances: { type: Number, default: 0 },
  epf_employee: { type: Number, default: 0 },
  epf_employer: { type: Number, default: 0 },
  nps_employer: { type: Number, default: 0 },
  other_income: { type: Number, default: 0 },

  // Step 3: Family Income Details
  mother_income_source: { type: String, default: '' },
  mother_tax_payer: { type: Boolean, default: false },
  mother_income_above_10L: { type: Boolean, default: false },
  mother_home_owner: { type: Boolean, default: false },

  father_income_source: { type: String, default: '' },
  father_tax_payer: { type: Boolean, default: false },
  father_income_above_10L: { type: Boolean, default: false },
  father_home_owner: { type: Boolean, default: false },

  spouse_income_source: { type: String, default: '' },
  spouse_tax_payer: { type: Boolean, default: false },
  spouse_income_above_10L: { type: Boolean, default: false },
  spouse_home_owner: { type: Boolean, default: false },

  house_rent_paid_to: { type: String, default: '' },

  // Step 4: Tax Deductible Cashflows
  nps_contribution_direct: { type: Number, default: 0 },
  elss_investment: { type: Number, default: 0 },
  ppf_investment: { type: Number, default: 0 },
  home_loan_principal: { type: Number, default: 0 },
  ssy: { type: Number, default: 0 },
  tax_saving_fd: { type: Number, default: 0 },
  interest_saving_account: { type: Number, default: 0 },
  interest_component_education: { type: Number, default: 0 },
  interest_home_loan: { type: Number, default: 0 },
  self_medical_premium: { type: Number, default: 0 },
  house_rent_paid: { type: Number, default: 0 },
  parents_medical_premium: { type: Number, default: 0 },


  // File fields using ObjectId references to File collection
  salary_slip: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
  previous_it_return: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
  tax_declaration: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
  capital_gain_statement: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
  unrealised_gains_losses: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
  additional_documents_file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
});




module.exports = mongoose.model('taxPlanningForm', taxPlanningSchema);




















