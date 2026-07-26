const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Others' },
  date: { type: Date, default: Date.now },
  description: { type: String, default: '' },
  paymentMethod: { type: String, default: 'Cash' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);