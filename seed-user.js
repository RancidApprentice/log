const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'school' });

const username = 'admin';
const plainPassword = 'admin123';

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
    if (err) throw err;
    console.log(`User "${username}" created with password "${plainPassword}"`);
    db.end();
  });
});

//run once node seed-user.js//