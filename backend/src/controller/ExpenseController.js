const Expense = require('../models/Expense');
const logTransaction = require('../utils/logTransaction');
const notify = require('../utils/notify');
const { syncBudgetsForExpense } = require('./budgetController');

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
  res.json(expenses);
};

exports.createExpense = async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user.id });
  await logTransaction(req.user.id, 'expense', expense._id, expense.title, expense.amount);
  await syncBudgetsForExpense(req.user.id, expense.category, expense.date);
  await notify(
    req.user.id,
    `New expense added: ${expense.title} — Rs. ${expense.amount}`,
    'expense-added'
  );
  res.status(201).json(expense);
};

exports.updateExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
  if (!expense) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(expense, req.body);
  await expense.save();
  await syncBudgetsForExpense(req.user.id, expense.category, expense.date);
  res.json(expense);
};

exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
  if (!expense) return res.status(403).json({ message: 'Forbidden' });
  await expense.deleteOne();
  await syncBudgetsForExpense(req.user.id, expense.category, expense.date);
  res.json({ message: 'Expense deleted' });
};