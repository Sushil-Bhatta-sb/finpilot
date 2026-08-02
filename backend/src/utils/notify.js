const Notification = require('../models/Notification');
const { emitToUser } = require('../socket');

// Create a persisted notification and push it to the user's private socket
// room in real time. Safe to call even if Socket.io isn't initialized.
async function notify(userId, message, type) {
  const notification = await Notification.create({ user: userId, message, type });
  emitToUser(userId, 'notification', notification);
  return notification;
}

module.exports = notify;
