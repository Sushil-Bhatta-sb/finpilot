const express = require('express');
const router = express.Router();
const {
  getNotifications,
  deleteNotification,
  markRead,
} = require('../controller/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.delete('/:id', deleteNotification);
router.put('/:id/read', markRead);

module.exports = router;
