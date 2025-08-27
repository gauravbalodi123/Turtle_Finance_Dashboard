//Investment Form

const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    // Expenses
    monthly_expenses: { type: String, default: '' },
    annual_expenses: { type: String, default: '' },

    // Income
    salary_1: { type: String, default: '' },
    salary_2: { type: String, default: '' },
    business_1: { type: String, default: '' },
    business_2: { type: String, default: '' },
    other_income: { type: String, default: '' },

    // Assets
    house: { type: String, default: '' },
    property_1: { type: String, default: '' },
    property_2: { type: String, default: '' },
    property_3: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    other_assets: { type: String, default: '' },
    bank_fds: { type: String, default: '' },
    savings_accounts: { type: String, default: '' },
    debt_mutual_funds: { type: String, default: '' },
    equity_mutual_funds: { type: String, default: '' },
    stocks_equity: { type: String, default: '' },
    epf_balance: { type: String, default: '' },
    ppf_balance: { type: String, default: '' },
    nps_balance: { type: String, default: '' },
    other_bonds: { type: String, default: '' },
    any_other_investments: { type: String, default: '' },

    // Financial Goals
    goal_time_1: { type: String, default: '' },
    goal_amount_1: { type: String, default: '' },
    goal_time_2: { type: String, default: '' },
    goal_amount_2: { type: String, default: '' },
    goal_time_3: { type: String, default: '' },
    goal_amount_3: { type: String, default: '' },
    goal_time_4: { type: String, default: '' },
    goal_amount_4: { type: String, default: '' },
    goal_time_5: { type: String, default: '' },
    goal_amount_5: { type: String, default: '' },
    goal_time_6: { type: String, default: '' },
    goal_amount_6: { type: String, default: '' },
    goal_time_7: { type: String, default: '' },
    goal_amount_7: { type: String, default: '' },
    goal_time_8: { type: String, default: '' },
    goal_amount_8: { type: String, default: '' },

    // Loans
    home_loan_1: { type: String, default: '' },
    home_loan_emi_1: { type: String, default: '' },
    vehicle_loan: { type: String, default: '' },
    vehicle_loan_emi: { type: String, default: '' },
    education_loan: { type: String, default: '' },
    education_loan_emi: { type: String, default: '' },
    personal_loan: { type: String, default: '' },
    personal_loan_emi: { type: String, default: '' },
    other_loan_1: { type: String, default: '' },
    other_loan_emi_1: { type: String, default: '' },
    other_loan_2: { type: String, default: '' },
    other_loan_emi_2: { type: String, default: '' },
    other_loan_3: { type: String, default: '' },
    other_loan_emi_3: { type: String, default: '' },

    // Insurance
    self_health_cover: { type: String, default: '' },
    self_life_cover: { type: String, default: '' },
    spouse_health_cover: { type: String, default: '' },
    spouse_life_cover: { type: String, default: '' },
    parents_health_cover: { type: String, default: '' },
    parents_life_cover: { type: String, default: '' },

    // Mutual Funds
    mutual_fund_scheme_1: { type: String, default: '' },
    mutual_fund_value_1: { type: String, default: '' },
    mutual_fund_sip_1: { type: String, default: '' },

    mutual_fund_scheme_2: { type: String, default: '' },
    mutual_fund_value_2: { type: String, default: '' },
    mutual_fund_sip_2: { type: String, default: '' },

    mutual_fund_scheme_3: { type: String, default: '' },
    mutual_fund_value_3: { type: String, default: '' },
    mutual_fund_sip_3: { type: String, default: '' },

    mutual_fund_scheme_4: { type: String, default: '' },
    mutual_fund_value_4: { type: String, default: '' },
    mutual_fund_sip_4: { type: String, default: '' },

    mutual_fund_scheme_5: { type: String, default: '' },
    mutual_fund_value_5: { type: String, default: '' },
    mutual_fund_sip_5: { type: String, default: '' },

    mutual_fund_scheme_6: { type: String, default: '' },
    mutual_fund_value_6: { type: String, default: '' },
    mutual_fund_sip_6: { type: String, default: '' },

    mutual_fund_scheme_7: { type: String, default: '' },
    mutual_fund_value_7: { type: String, default: '' },
    mutual_fund_sip_7: { type: String, default: '' },

    mutual_fund_scheme_8: { type: String, default: '' },
    mutual_fund_value_8: { type: String, default: '' },
    mutual_fund_sip_8: { type: String, default: '' },

    mutual_fund_scheme_9: { type: String, default: '' },
    mutual_fund_value_9: { type: String, default: '' },
    mutual_fund_sip_9: { type: String, default: '' },

    mutual_fund_scheme_10: { type: String, default: '' },
    mutual_fund_value_10: { type: String, default: '' },
    mutual_fund_sip_10: { type: String, default: '' },

    mutual_fund_scheme_11: { type: String, default: '' },
    mutual_fund_value_11: { type: String, default: '' },
    mutual_fund_sip_11: { type: String, default: '' },

    mutual_fund_scheme_12: { type: String, default: '' },
    mutual_fund_value_12: { type: String, default: '' },
    mutual_fund_sip_12: { type: String, default: '' },

    mutual_fund_scheme_13: { type: String, default: '' },
    mutual_fund_value_13: { type: String, default: '' },
    mutual_fund_sip_13: { type: String, default: '' },

    mutual_fund_scheme_14: { type: String, default: '' },
    mutual_fund_value_14: { type: String, default: '' },
    mutual_fund_sip_14: { type: String, default: '' },

    mutual_fund_scheme_15: { type: String, default: '' },
    mutual_fund_value_15: { type: String, default: '' },
    mutual_fund_sip_15: { type: String, default: '' },

    // Stocks
    stock_company_1: { type: String, default: '' },
    stock_shares_1: { type: String, default: '' },
    stock_value_1: { type: String, default: '' },
    stock_company_2: { type: String, default: '' },
    stock_shares_2: { type: String, default: '' },
    stock_value_2: { type: String, default: '' },
    stock_company_3: { type: String, default: '' },
    stock_shares_3: { type: String, default: '' },
    stock_value_3: { type: String, default: '' },
    stock_company_4: { type: String, default: '' },
    stock_shares_4: { type: String, default: '' },
    stock_value_4: { type: String, default: '' },
    stock_company_5: { type: String, default: '' },
    stock_shares_5: { type: String, default: '' },
    stock_value_5: { type: String, default: '' },
    stock_company_6: { type: String, default: '' },
    stock_shares_6: { type: String, default: '' },
    stock_value_6: { type: String, default: '' },
    stock_company_7: { type: String, default: '' },
    stock_shares_7: { type: String, default: '' },
    stock_value_7: { type: String, default: '' },
    stock_company_8: { type: String, default: '' },
    stock_shares_8: { type: String, default: '' },
    stock_value_8: { type: String, default: '' },

    // Additional fields for stocks and investments as needed

    // File fields for storing file paths or URLs
    investment_file: { type: String, required: false },  // Path or URL for Life Insurance Policy file
    additional_documents_file: { type: String, required: false },  // Path or URL for Additional Documents
});

module.exports = mongoose.model('investmentForm', investmentSchema);
