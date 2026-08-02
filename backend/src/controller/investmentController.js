const Investment = require('../models/Investment');
const logTransaction = require('../utils/logTransaction');
const notify = require('../utils/notify');

exports.getInvestments = async (req, res) => {
  const investments = await Investment.find({ user: req.user.id }).sort({ date: -1 });
  res.json(investments);
};

exports.createInvestment = async (req, res) => {
  const investment = await Investment.create({ ...req.body, user: req.user.id });
  await logTransaction(
    req.user.id,
    'investment',
    investment._id,
    `Invested in ${investment.name} (${investment.type})`,
    investment.amountInvested
  );
  await notify(
    req.user.id,
    `New investment added: ${investment.name} — Rs. ${investment.amountInvested}`,
    'investment-added'
  );
  res.status(201).json(investment);
};

exports.updateInvestment = async (req, res) => {
  const investment = await Investment.findOne({ _id: req.params.id, user: req.user.id });
  if (!investment) return res.status(404).json({ message: 'Investment not found' });
  Object.assign(investment, req.body);
  await investment.save();
  res.json(investment);
};

exports.deleteInvestment = async (req, res) => {
  const investment = await Investment.findOne({ _id: req.params.id, user: req.user.id });
  if (!investment) return res.status(404).json({ message: 'Investment not found' });
  await investment.deleteOne();
  res.json({ message: 'Investment deleted' });
};
