const config = require('config');
const app = require('./app');
const mongoose = require('mongoose');
const PORT = config.get('port') || 3001;

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
