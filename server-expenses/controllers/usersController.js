const User = require('../model/User')

const getAllUsers = async(req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ 'message': 'No users found.'})
  res.json(users);
}

const getUserByUsername = async(req, res) => {
  const { username } = req.params
  const user = await User.findOne({ username }).exec();
  const userData = {
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    categories: user.categories,
    paymentMethods: user.paymentMethods
  }
  if (!user) return res.status(204).json({ 'message': 'User not found.'})
  res.json(userData);
}

const getUserCategories = async (req, res) => {
  const { username } = req.params
  const categories = await User.findOne({ username }).select('categories');
  res.json(categories)
}

const getUserPaymentMethods = async (req, res) => {
  const { username } = req.params
  const paymentMethods = await User.findOne({ username }).select('paymentMethods');
  res.json(paymentMethods)
}

const editUser = async(req, res) => {
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    { $set: req.body },
  );
  res.json(user);
}

const addUserCategory = async (req, res) => {
  const { username } = req.params;
  const { data } = req.body;
  // console.log(data)

  const user = await User.findOne({ username });
  user.addCategory(data);
  await user.save();
  res.json({ message: 'Category added successfully.', user: user });
}

const removeUserCategory = async(req, res) => {
  const {username} = req.params;
  const {category} = req.body;

  const user = await User.findOne({username});
  user.removeCategory(category);
  await user.save();
  res.json({ message: 'Category removed successfully.', user: user });
}

const addUserPaymentMethod = async (req, res) => {
  const { username } = req.params;
  const { data } = req.body;
  // console.log(data)

  const user = await User.findOne({ username });
  user.addPaymentMethod(data);
  await user.save();
  res.json({ message: 'Payment Method added successfully.', user: user });
}

const removeUserPaymentMethod = async(req, res) => {
  const {username} = req.params;
  const {paymentMethod} = req.body;

  const user = await User.findOne({username});
  user.removePaymentMethod(paymentMethod);
  await user.save();
  res.json({ message: 'Payment Method removed successfully.', user: user });
}

     
module.exports = {
  getAllUsers,
  getUserByUsername,
  getUserCategories,
  getUserPaymentMethods,
  editUser,
  addUserCategory,
  removeUserCategory,
  addUserPaymentMethod,
  removeUserPaymentMethod,
}