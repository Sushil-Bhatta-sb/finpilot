const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllReports,
  getStats,
  suspendUser,
} = require('../controller/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/suspend', suspendUser);
router.get('/reports', getAllReports);
router.get('/stats', getStats);

module.exports = router;
