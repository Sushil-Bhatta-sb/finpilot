const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, trim: true },
  limit: { type: Number, required: true, min: 0 },
  spent: { type: Number, default: 0, min: 0 },
  month: { type: String, required: true, trim: true }, // format "YYYY-MM"
}, { timestamps: true });

budgetSchema.index({ user: 1, month: 1, category: 1 }, { unique: true });

budgetSchema.methods.remaining = function () {
  return this.limit - this.spent;
};

budgetSchema.methods.isExceeded = function () {
  return this.spent > this.limit;
};

module.exports = mongoose.model('Budget', budgetSchema);
