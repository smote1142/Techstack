const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Snehal', // 🔁 Replace with your MySQL password
  database: 'portfolio'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ MySQL connected!');
});

module.exports = db;
