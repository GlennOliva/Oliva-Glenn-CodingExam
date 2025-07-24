const db = require('../Config/db'); // ✅ MySQL connection via mysql2

// 🔹 Get all borrowers
exports.getBorrower = (callback) => {
  const sql = 'SELECT * FROM borrowers';
  db.query(sql, callback);
};

// 🔹 Add a new borrower
exports.addBorrower = (data, callback) => {
  const sql = `
    INSERT INTO borrowers (full_name, max_books_allowed, current_borrowed)
    VALUES (?, ?, ?)
  `;
  const values = [
    data.full_name,
    data.max_books_allowed,
    data.current_borrowed
  ];
  db.query(sql, values, callback);
};

// 🔹 Delete a borrower
exports.deleteBorrower = (id, callback) => {
  const sql = 'DELETE FROM borrowers WHERE id = ?';
  db.query(sql, [id], callback);
};

// 🔹 Update a borrower by ID
exports.updateBorrower = (id, data, callback) => {
  const sql = `
    UPDATE borrowers
    SET full_name = ?, max_books_allowed = ?, current_borrowed = ?
    WHERE id = ?
  `;
  const values = [
    data.full_name,
    data.max_books_allowed,
    data.current_borrowed,
    id
  ];
  db.query(sql, values, callback);
};
