const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  depositToGoal,
} = require('../controller/savingsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getGoals).post(createGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);
router.post('/:id/deposit', depositToGoal);

module.exports = router;
