const mongoose = require('mongoose')

const connectDB = async () => {
  try{
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.0dze4q2.mongodb.net/ExpensesDb?retryWrites=true&w=majority`|| process.env.DATABASE_URI);
  }catch (err){
    console.log(err)
  }
}

module.exports = connectDB;