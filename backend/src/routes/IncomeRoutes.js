const express = require('express');
const router = express.Router();
const { getIncomes, createIncome, updateIncome, deleteIncome } = require('../controller/IncomeController');

router.route('/').get(getIncomes).post(createIncome);
router.route('/:id').put(updateIncome).delete(deleteIncome);

module.exports = router;