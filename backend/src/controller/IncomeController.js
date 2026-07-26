const Income = require('../models/Income');

exports.getIncomes = async (req, res) => {
  const incomes = await Income.find().sort({ date: -1 });
  res.json(incomes);
};

exports.createIncome = async (req, res) => {
  const income = await Income.create(req.body);
  res.status(201).json(income);
};

exports.updateIncome = async (req, res) => {
  const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!income) return res.status(404).json({ message: 'Income not found' });
  res.json(income);
};

exports.deleteIncome = async (req, res) => {
  const income = await Income.findByIdAndDelete(req.params.id);
  if (!income) return res.status(404).json({ message: 'Income not found' });
  res.json({ message: 'Income deleted' });
};