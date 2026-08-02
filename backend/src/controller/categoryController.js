const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const category = await Category.create({ ...req.body, user: req.user.id });
  res.status(201).json(category);
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  Object.assign(category, req.body);
  await category.save();
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  await category.deleteOne();
  res.json({ message: 'Category deleted' });
};
