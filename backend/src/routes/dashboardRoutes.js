const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controller/dashboardController');

// Allow public access to dashboard stats — controller returns
// empty/default stats for unauthenticated users.
router.get('/stats', getDashboardStats);

module.exports = router;
