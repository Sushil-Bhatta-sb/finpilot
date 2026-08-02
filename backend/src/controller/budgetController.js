const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const logTransaction = require('../utils/logTransaction');
const notify = require('../utils/notify');

const monthOf = (date) => new Date(date).toISOString().slice(0, 7);

// Recalculate `spent` by summing this user's expenses for the budget's
// category within the budget's month, using an aggregation pipeline.
async function recalcBudgetSpent(budget) {
  const start = new Date(`${budget.month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);

  const agg = await Expense.aggregate([
    {
      $match: {
        user: budget.user,
        category: budget.category,
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  budget.spent = agg.length ? agg[0].total : 0;
  await budget.save();
  return budget;
}

// Emit a budget-alert notification when spending crosses 80/90/100% of limit.
async function checkBudgetThresholds(budget) {
  if (!budget.limit) return;
  const pct = (budget.spent / budget.limit) * 100;

  let threshold = null;
  if (pct >= 100) threshold = 100;
  else if (pct >= 90) threshold = 90;
  else if (pct >= 80) threshold = 80;
  if (!threshold) return;

  const message =
    threshold >= 100
      ? `Budget exceeded for ${budget.category} (${budget.month}): spent Rs. ${budget.spent} of Rs. ${budget.limit}.`
      : `Budget alert: ${threshold}% of your ${budget.category} budget (${budget.month}) used — Rs. ${budget.spent} of Rs. ${budget.limit}.`;

  await notify(budget.user, message, 'budget-alert');
}

// Called from the expense controller whenever an expense changes so the
// matching budget stays accurate and alerts fire in real time.
async function syncBudgetsForExpense(userId, category, date) {
  if (!category || !date) return;
  const month = monthOf(date);
  const budget = await Budget.findOne({ user: userId, category, month });
  if (!budget) return;
  await recalcBudgetSpent(budget);
  await checkBudgetThresholds(budget);
}

exports.getBudgets = async (req, res) => {
  const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(budgets);
};

exports.createBudget = async (req, res) => {
  const budget = await Budget.create({ ...req.body, user: req.user.id });
  await recalcBudgetSpent(budget);
  await checkBudgetThresholds(budget);
  await logTransaction(req.user.id, 'budget', budget._id, `Budget set for ${budget.category}`, budget.limit);
  res.status(201).json(budget);
};

exports.updateBudget = async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  Object.assign(budget, req.body);
  await budget.save();
  await recalcBudgetSpent(budget);
  await checkBudgetThresholds(budget);
  res.json(budget);
};

exports.deleteBudget = async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  await budget.deleteOne();
  res.json({ message: 'Budget deleted' });
};

// Exported for use by the expense controller.
exports.recalcBudgetSpent = recalcBudgetSpent;
exports.checkBudgetThresholds = checkBudgetThresholds;
exports.syncBudgetsForExpense = syncBudgetsForExpense;
