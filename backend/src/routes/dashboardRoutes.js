const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controller/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getDashboardStats);

module.exports = router;
