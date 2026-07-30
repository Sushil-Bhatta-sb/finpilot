const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'Others', trim: true },
  date: { type: Date, default: Date.now },
  description: { type: String, default: '', trim: true },
  paymentMethod: { type: String, default: 'Cash', trim: true },
}, { timestamps: true });

expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);