const mongoose = require('mongoose');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Investment = require('../models/Investment');
const SavingsGoal = require('../models/SavingsGoal');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

const sumField = async (Model, match, field) => {
  const agg = await Model.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: `$${field}` } } },
  ]);
  return agg.length ? agg[0].total : 0;
};

exports.getDashboardStats = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const month = new Date().toISOString().slice(0, 7);
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  const monthRange = { date: { $gte: start, $lt: end } };

  const [
    totalIncome,
    totalExpense,
    totalSavings,
    totalInvestmentValue,
    budgets,
    recentTransactions,
    unreadNotificationsCount,
  ] = await Promise.all([
    sumField(Income, { user: userId, ...monthRange }, 'amount'),
    sumField(Expense, { user: userId, ...monthRange }, 'amount'),
    sumField(SavingsGoal, { user: userId }, 'savedAmount'),
    sumField(Investment, { user: userId }, 'currentValue'),
    Budget.find({ user: userId, month }).sort({ category: 1 }),
    Transaction.find({ user: userId }).sort({ date: -1 }).limit(10),
    Notification.countDocuments({ user: userId, read: false }),
  ]);

  const budgetProgress = budgets.map((b) => ({
    category: b.category,
    limit: b.limit,
    spent: b.spent,
    percentUsed: b.limit ? Math.round((b.spent / b.limit) * 100) : 0,
  }));

  res.json({
    totalIncome,
    totalExpense,
    currentBalance: totalIncome - totalExpense,
    totalSavings,
    totalInvestmentValue,
    budgetProgress,
    recentTransactions,
    unreadNotificationsCount,
  });
};
