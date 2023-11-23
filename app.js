// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users = require("./mocks/user.json")

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/grand_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, 
  // useFindAndModify: false, 
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'hiearth!', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  const user = users.list.find(u => u.id === id);
  done(null, user);
});

// Local strategy for authentication
passport.use(new LocalStrategy((username, password, done) => {
  // Find user by username
  const user = users.list.find(u => u.username === username);

  if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
  }

  // Check password
  if (user.password !== password) {
    return done(null, false, { message: 'Incorrect password.' });
  }

  // Authentication successful
  return done(null, user);
}));

// Routes
const indexRouter = require('./routes/index');
const productsRouter = require('./routes/product');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
