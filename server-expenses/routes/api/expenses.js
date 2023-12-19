const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expensesController')
const verifyUser = require('../../middleware/verifyUser');


router.route('/:username/allExpenses')
  .get(verifyUser, expensesController.getUserExpenses)
  
router.route('/:username/addExpense')
  .post(verifyUser, expensesController.handleNewExpense)

router.route('/:username/:expenseId')
  .delete(verifyUser, expensesController.deleteExpense)
  .patch(verifyUser, expensesController.editUserExpense)

router.route('/:username/recent')
  .get(verifyUser, expensesController.getRecentExpenses)

router.route('/:username/monthlyTotals')
  .get(verifyUser, expensesController.getMonthlyTotals)

router.route('/:username/yearlyTotals')
  .get(verifyUser, expensesController.getYearlyTotals)

router.route('/:username/categoryTotals')
  .get(verifyUser, expensesController.getCategoryTotals)

router.route('/:username/categories')
  .get(verifyUser, expensesController.getCategories)
  
module.exports = router;