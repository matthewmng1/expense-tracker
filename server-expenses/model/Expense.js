const mongoose = require('mongoose');
const Schema = mongoose.Schema;

expenseSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  category: { 
    type: String, 
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
})

expenseSchema.index({ date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);

// date, description, category, amount, payment_method