require('dotenv').config();

const app = require('./app');
const mongoose = require('mongoose');
const PORT = +process.env.PORT || 3001;

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})