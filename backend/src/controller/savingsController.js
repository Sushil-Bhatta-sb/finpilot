const SavingsGoal = require('../models/SavingsGoal');
const logTransaction = require('../utils/logTransaction');
const notify = require('../utils/notify');

exports.getGoals = async (req, res) => {
  const goals = await SavingsGoal.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(goals);
};

exports.createGoal = async (req, res) => {
  const goal = await SavingsGoal.create({ ...req.body, user: req.user.id });
  await logTransaction(req.user.id, 'savings', goal._id, `Savings goal "${goal.title}" created`, goal.savedAmount);
  await notify(req.user.id, `New savings goal created: "${goal.title}"`, 'savings-updated');
  res.status(201).json(goal);
};

exports.updateGoal = async (req, res) => {
  const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) return res.status(404).json({ message: 'Savings goal not found' });
  Object.assign(goal, req.body);
  await goal.save();
  res.json(goal);
};

exports.deleteGoal = async (req, res) => {
  const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) return res.status(404).json({ message: 'Savings goal not found' });
  await goal.deleteOne();
  res.json({ message: 'Savings goal deleted' });
};

// POST /:id/deposit — increment savedAmount, mark complete + notify if reached.
exports.depositToGoal = async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'A positive amount is required' });
  }

  const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) return res.status(404).json({ message: 'Savings goal not found' });

  const wasCompleted = goal.completed;
  goal.savedAmount += amount;
  await goal.save(); // pre-save hook flips `completed` when target reached

  await logTransaction(req.user.id, 'savings', goal._id, `Deposit to "${goal.title}"`, amount);

  if (!wasCompleted && goal.completed) {
    await notify(
      req.user.id,
      `Congratulations! You reached your savings goal "${goal.title}".`,
      'goal-completed'
    );
  } else {
    await notify(
      req.user.id,
      `Deposited Rs. ${amount} to "${goal.title}".`,
      'savings-updated'
    );
  }

  res.json(goal);
};
