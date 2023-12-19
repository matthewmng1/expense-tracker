const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  normalizedUsername: {
    type: String,
    lowercase: true, 
    unique: true, 
    sparse: true 
  },
  roles: {
    User: {
      type: Number,
      default: 200
    },
    Admin: Number
  },
  password: {
    type: String,
    require: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  refreshToken: [String],
  categories: {
    type: [String],
    default: [
      'Miscellaneous', 
      'Entertainment', 
      'Shopping', 
      'Food & Dining', 
      'Education', 
      'Personal Care', 
      'Health & Fitness', 
      'Gifts & Donations', 
      'Bills & Utilities', 
      'Travel', 
      'Business',
      'Auto & Transport',
    ]
  },
  paymentMethods: {
    type: [String],
    default: [
      'Credit Card',
      'Debit Card',
      'Cash',
      'Venmo',
      'Zelle'
    ]
  },
  expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
});

userSchema.methods.addCategory = function(newCategory) {
  this.categories.push(newCategory);
};

userSchema.methods.removeCategory = function(categoryToRemove) {
  this.categories = this.categories.filter(category => category !== categoryToRemove);
};

userSchema.methods.addPaymentMethod = function(newPaymentMethod) {
  this.paymentMethods.push(newPaymentMethod);
};

userSchema.methods.removePaymentMethod = function(paymentMethodToRemove) {
  this.paymentMethods = this.paymentMethods.filter(paymentMethod => paymentMethod !== paymentMethodToRemove);
};


module.exports = mongoose.model('User', userSchema)


// Categories 
// User has a set of 12 default categories
// user should be able to Add & Remove categories in settings
// Categories should appear in a dropdown list to be chosen for each Expense