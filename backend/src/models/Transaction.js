const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['income', 'expense', 'budget', 'investment', 'savings'],
    required: true,
  },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true },
  description: { type: String, trim: true },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
