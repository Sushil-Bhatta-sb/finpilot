const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
};

exports.deleteNotification = async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  await notification.deleteOne();
  res.json({ message: 'Notification deleted' });
};

exports.markRead = async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  notification.read = true;
  await notification.save();
  res.json(notification);
};
