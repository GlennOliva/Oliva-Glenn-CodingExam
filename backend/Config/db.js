// ✅ Import mysql2
const mysql = require('mysql');

// ✅ Create the connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'coding_exam',
});

// ✅ Optional: Test the connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// ✅ Export the connection
module.exports = db;
