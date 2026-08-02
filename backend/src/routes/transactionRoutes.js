const express = require('express');
const router = express.Router();
const {
  getTransactions,
  exportCSV,
  exportPDF,
} = require('../controller/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getTransactions);
router.get('/export/csv', exportCSV);
router.get('/export/pdf', exportPDF);

module.exports = router;
