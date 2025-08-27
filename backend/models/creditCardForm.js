//Credit card

const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
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
  // Cards
  card1: { type: String, },
  card2: { type: String, },
  card3: { type: String, },

  // Expenses
  monthly_expenses: { type: Number, },
  rent: { type: Number, },
  fuel: { type: Number, },
  utilities: { type: Number, },
  fees: { type: Number, },
  shopping: { type: Number, },
  dining_out: { type: Number, },
  ordering_in: { type: Number, },
  forex: { type: Number, },
  flights: { type: Number, },
  hotels: { type: Number, },

  // Rewards
  cashback: { type: Number, },
  rewards: { type: Number, },
  luxury: { type: Number, },

  additional_documents_file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: false,
  },
});

module.exports = mongoose.model('creditCardForm', creditCardSchema);
