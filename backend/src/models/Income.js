const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, default: 'Other' },
  paymentMethod: { type: String, default: 'Cash' },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);