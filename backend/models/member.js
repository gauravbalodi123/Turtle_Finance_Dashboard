const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', MemberSchema);
