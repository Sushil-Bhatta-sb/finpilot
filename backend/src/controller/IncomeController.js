const Income = require('../models/Income');
const logTransaction = require('../utils/logTransaction');
const notify = require('../utils/notify');

exports.getIncomes = async (req, res) => {
  const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
  res.json(incomes);
};

exports.createIncome = async (req, res) => {
  const income = await Income.create({ ...req.body, user: req.user.id });
  await logTransaction(req.user.id, 'income', income._id, income.title, income.amount);
  await notify(
    req.user.id,
    `New income added: ${income.title} — Rs. ${income.amount}`,
    'income-added'
  );
  res.status(201).json(income);
};

exports.updateIncome = async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user.id });
  if (!income) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(income, req.body);
  await income.save();
  res.json(income);
};

exports.deleteIncome = async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user.id });
  if (!income) return res.status(403).json({ message: 'Forbidden' });
  await income.deleteOne();
  res.json({ message: 'Income deleted' });
};