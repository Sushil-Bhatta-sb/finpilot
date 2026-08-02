const User = require('../models/User');

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  photo: user.photo,
  currency: user.currency,
  timezone: user.timezone,
  theme: user.theme,
});

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(publicUser(user));
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const allowed = ['name', 'phone', 'photo', 'currency', 'timezone', 'theme'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  await user.save();
  res.json(publicUser(user));
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

  user.password = newPassword; // pre-save hook re-hashes
  await user.save();

  res.json({ message: 'Password updated successfully' });
};
