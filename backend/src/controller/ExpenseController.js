const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
  res.json(expenses);
};

exports.createExpense = async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user.id });
  res.status(201).json(expense);
};

exports.updateExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
  if (!expense) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(expense, req.body);
  await expense.save();
  res.json(expense);
};

exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
  if (!expense) return res.status(403).json({ message: 'Forbidden' });
  await expense.deleteOne();
  res.json({ message: 'Expense deleted' });
};