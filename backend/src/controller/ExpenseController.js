const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
};

exports.createExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.status(201).json(expense);
};

exports.updateExpense = async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json(expense);
};

exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Expense deleted' });
};