require('dotenv').config();

const path = require('path')
const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;

app.use(express.static('build'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-front', 'build', 'index.html'))
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})