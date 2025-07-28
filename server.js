const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('db.sqlite');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
  })
);

// DB Setup
// Users: id, username, password
// Notes: id, user_id, content

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)'
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, content TEXT, FOREIGN KEY(user_id) REFERENCES users(id))'
  );
});

// Auth middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Routes
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// Register
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('register', { error: 'Username and password required.' });
  }
  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    function (err) {
      if (err) {
        let msg = 'Registration failed.';
        if (err.message.includes('UNIQUE')) {
          msg = 'Username already taken.';
        }
        return res.render('register', { error: msg });
      }
      res.redirect('/login');
    }
  );
});

// Login
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('login', { error: 'Username and password required.' });
  }
  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, user) => {
      if (err || !user) {
        return res.render('login', { error: 'Invalid username or password.' });
      }
      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect('/dashboard');
    }
  );
});

// Dashboard
app.get('/dashboard', requireLogin, (req, res) => {
  db.all(
    'SELECT * FROM notes WHERE user_id = ?',
    [req.session.userId],
    (err, notes) => {
      res.render('dashboard', {
        username: req.session.username,
        notes: notes || [],
      });
    }
  );
});

// New Note
app.get('/notes/new', requireLogin, (req, res) => {
  res.render('new-note', { error: null });
});

app.post('/notes/new', requireLogin, (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.render('new-note', { error: 'Note content required.' });
  }
  db.run(
    'INSERT INTO notes (user_id, content) VALUES (?, ?)',
    [req.session.userId, content],
    function (err) {
      if (err) {
        return res.render('new-note', { error: 'Failed to save note.' });
      }
      res.redirect('/dashboard');
    }
  );
});

// Logout
app.post('/logout', requireLogin, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 