const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Stocks', 'Mutual Funds', 'Crypto', 'Gold', 'Fixed Deposit', 'Real Estate'],
    required: true,
  },
  amountInvested: { type: Number, required: true, min: 0 },
  currentValue: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

investmentSchema.virtual('profitLoss').get(function () {
  return this.currentValue - this.amountInvested;
});

module.exports = mongoose.model('Investment', investmentSchema);
