const express = require('express');
const app = express();
const path = require('path')

const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT')
const connectDB = require('./config/dbConn');

connectDB();


app.use(express.json());
app.use(cookieParser());

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }))


//public routes
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use("/logout", require("./routes/logout"))

// protected routes
app.use(verifyJWT)
app.use('/users', require('./routes/api/users'))
// app.use('/users/:userId', require('./routes/api/users'))
app.use('/users/:username', require('./routes/api/users'))
app.use('/expenses', require('./routes/api/expenses'))
app.use('/expenses/:username', require('./routes/api/expenses'))


app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});

module.exports = app;
