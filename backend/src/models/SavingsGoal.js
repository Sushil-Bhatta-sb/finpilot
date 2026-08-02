const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  targetAmount: { type: Number, required: true, min: 0 },
  savedAmount: { type: Number, default: 0, min: 0 },
  targetDate: { type: Date },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

savingsGoalSchema.pre('save', function () {
  if (this.savedAmount >= this.targetAmount) {
    this.completed = true;
  }
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
