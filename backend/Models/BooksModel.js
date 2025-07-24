const db = require('../Config/db'); // Make sure db.js connects MySQL using mysql2

// 🔹 Get all books
exports.getBooks = (callback) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, callback);
};

// 🔹 Add a new books
exports.addBooks = (data, callback) => {
  const sql = `
    INSERT INTO books (title , author , total_copies , available_copies , penalty_per_day)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    data.title,
    data.author,
    data.total_copies,
    data.avaialble_copies,
    data.penalty_per_day
  ];
  db.query(sql, values, callback);
};

// 🔹 Delete an book by ID
exports.deleteBooks = (id, callback) => {
  const sql = 'DELETE FROM books WHERE id = ?';
  db.query(sql, [id], callback);
};

// 🔹 Update an expense by ID
exports.updateBooks = (id, data, callback) => {
  const sql = `
    UPDATE books
    SET title = ? , author = ?, total_copies = ?, available_copies = ?, penalty_per_day = ?
    WHERE id = ?
  `;
  const values = [
    data.title,
    data.author,
    data.total_copies,
    data.available_copies,
    data.penalty_per_day,
    id
  ];
  db.query(sql, values, callback);
};