const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  category: { type: String, default: 'Other', trim: true },
  paymentMethod: { type: String, default: 'Cash', trim: true },
  description: { type: String, default: '', trim: true },
}, { timestamps: true });

incomeSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Income', incomeSchema);