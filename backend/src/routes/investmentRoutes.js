const express = require('express');
const router = express.Router();
const {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} = require('../controller/investmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getInvestments).post(createInvestment);
router.route('/:id').put(updateInvestment).delete(deleteInvestment);

module.exports = router;
