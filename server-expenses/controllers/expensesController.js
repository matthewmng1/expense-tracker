const Expense = require('../model/Expense')

const handleNewExpense = async(req, res) => {

  // console.log(req.user)
  const {
    date,
    description,
    category,
    amount,
    paymentMethod
  } = req.body;

  if(!date ||
     !description ||
     !category ||
     !amount ||
     !paymentMethod)
      return res.status(400).json({ 'message': 'All fields are required' });

  try{
    const result = await Expense.create({
      "date": new Date(date),
      "description": description,
      "category": category,
      "amount": amount,
      "paymentMethod": paymentMethod,
      "user": req.user,
    })

    // console.log(result)

    res.status(201).json({ 'success': `New expense added!` })
  } catch (err) {
    res.status(500).json({ 'message': err.message })
  }
}

const editUserExpense = async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    {_id: req.params.expenseId}, 
    {$set: req.body},
    { new: true }
  );
  res.json({ success: true, expense });
}

const getUserExpenses = async(req, res) => {
  const expenses = await Expense.find({user: req.params.username}).sort({ date: -1 });
  if (!expenses) return res.status(204).json({ 'message': 'No expense data.'})
  res.json(expenses);
}

const getRecentExpenses = async (req, res) => {
  const recentExpenses = await Expense.find({
    user: req.params.username,
    date: {
      $gte: req.query.lastWeekDate,
      $lte: req.query.currentDate
    }
  })
  if(!recentExpenses || recentExpenses.length === 0) return res.status(204).json({ 'message': 'No recent expense data,'});
  res.json(recentExpenses);
}

const getMonthlyTotals = async (req, res) => {
  console.log(req.params.username)
  const expenses = await Expense.aggregate([
    {
      $match: {user: req.params.username}
    },
    {
      $group: {
        _id: {
          year: {$year: "$date"},
          month: {$month: "$date"}
        },
        totalSpent: {$sum: "$amount"}
      }
    }
  ])
  if(!expenses || expenses.length === 0 ) return res.status(204).json({ 'message': 'No expense data'})
  res.json(expenses)
}

const getYearlyTotals = async (req, res) => {
  const allExpenses = await Expense.find({user:req.params.username})

  const expenses = await Expense.find({
    user: req.params.username,
    date: { 
      $gte: new Date(`${req.query.year}-01-01`), 
      $lt: new Date(`${req.query.year}-12-31`) },
  })
  if(!expenses || expenses.length === 0 ) return res.status(204).json({ 'message': 'No expense data'})

  const years = Array.from(new Set(allExpenses.map(expense => expense.date.getFullYear())));

  res.json({expenses, years})
}

const getCategoryTotals = async (req, res) => {
  const expenses = await Expense.aggregate([
    {
      $match: {user: req.params.username}
    },
    {
      $group: {
        _id: {
          year: {$year: "$date"},
          month: {$month: "$date"},
          category: "$category"
        },
        totalSpent: {$sum: "$amount"},
      }
    }
  ])
  if(!expenses || expenses.length === 0 ) return res.status(204).json({ 'message': 'No expense data'})
  res.json(expenses)
}

const deleteExpense = async(req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete({_id: req.params.expenseId});

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategories = async(req, res) => {
  const categories = await Expense.distinct('category');
  res.json(categories)
}

module.exports = {
  handleNewExpense,
  getUserExpenses,
  deleteExpense,
  editUserExpense,
  getRecentExpenses,
  getMonthlyTotals,
  getYearlyTotals,
  getCategoryTotals,
  getCategories,
}