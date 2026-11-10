const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'change-this-to-a-long-random-string',
  resave: false,
  saveUninitialized: false
}));

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'school' });

db.connect(err => err ? console.error('DB connection failed:', err.message) : console.log('Connected to MySQL'));

const query = (sql, params, cb) => db.query(sql, params, (err, rows) => err ? cb(err) : cb(null, rows));

// ── LOGIN GUARD ──
const isLoggedIn = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// ── LOGIN PAGE ──
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/main');
  res.render('login', { error: null });
});

// ── LOGIN SUBMIT ──
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
    if (err) return res.send(err.message);
    if (rows.length === 0) return res.render('login', { error: 'Wrong username or password' });
    bcrypt.compare(password, rows[0].password, (err, match) => {
      if (err) return res.send(err.message);
      if (!match) return res.render('login', { error: 'Wrong username or password' });
      req.session.user = rows[0].username;
      res.redirect('/main');
    });
  });
});

// ── LOGOUT ──
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ── CRUD (protected) ──
app.get('/main', isLoggedIn, (req, res) =>
  query('SELECT * FROM students', [], (err, rows) =>
    err ? res.send(err.message) : res.render('index', { students: rows, user: req.session.user })));

app.post('/add', isLoggedIn, (req, res) => {
  const { name, course } = req.body;
  query('INSERT INTO students (name, course) VALUES (?, ?)', [name, course],
    err => err ? res.send(err.message) : res.redirect('/main'));
});

app.get('/edit/:id', isLoggedIn, (req, res) =>
  query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, rows) =>
    err ? res.send(err.message) : res.render('edit', { student: rows[0] })));

app.post('/update/:id', isLoggedIn, (req, res) => {
  const { name, course } = req.body;
  query('UPDATE students SET name = ?, course = ? WHERE id = ?', [name, course, req.params.id],
    err => err ? res.send(err.message) : res.redirect('/main'));
});

app.post('/delete/:id', isLoggedIn, (req, res) =>
  query('DELETE FROM students WHERE id = ?', [req.params.id],
    err => err ? res.send(err.message) : res.redirect('/main')));

// ── ROOT REDIRECT ──
app.get('/', (req, res) => res.redirect(req.session.user ? '/main' : '/login'));

app.listen(3000, () => console.log('Server running at http://localhost:3000/login'));