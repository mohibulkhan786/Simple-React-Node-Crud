const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
