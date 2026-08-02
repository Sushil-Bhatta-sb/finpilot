const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Investment = require('../models/Investment');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};

// Aggregate activity across ALL users, grouped by month.
exports.getAllReports = async (req, res) => {
  const byMonth = (Model, amountField) =>
    Model.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
          ...(amountField ? { total: { $sum: `$${amountField}` } } : {}),
        },
      },
      { $sort: { _id: -1 } },
    ]);

  const [transactions, budgets, investments] = await Promise.all([
    byMonth(Transaction, 'amount'),
    byMonth(Budget, 'limit'),
    byMonth(Investment, 'amountInvested'),
  ]);

  res.json({ transactions, budgets, investments });
};

exports.getStats = async (req, res) => {
  const [totalUsers, totalTransactions, totalBudgets, totalInvestments] = await Promise.all([
    User.countDocuments(),
    Transaction.countDocuments(),
    Budget.countDocuments(),
    Investment.countDocuments(),
  ]);

  res.json({ totalUsers, totalTransactions, totalBudgets, totalInvestments });
};

// Toggle the `suspended` flag; suspended users are rejected by `protect`.
exports.suspendUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.suspended = !user.suspended;
  await user.save();
  res.json({ id: user._id, suspended: user.suspended });
};
