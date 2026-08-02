const Transaction = require('../models/Transaction');

// Shared helper to append a unified transaction-log entry whenever a
// domain record (income/expense/budget/investment/savings) changes.
async function logTransaction(userId, type, refId, description, amount) {
  return Transaction.create({
    user: userId,
    type,
    refId,
    description,
    amount,
  });
}

module.exports = logTransaction;
