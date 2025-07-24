const db = require('../Config/db'); // ✅ Ensure db.js uses mysql2


// ✅ Mark a book as returned
exports.markAsReturned = (transactionId, returnDate, penalty, callback) => {
  const sql = `
    UPDATE borrow_transactions
    SET return_date = ?, penalty_paid = ?
    WHERE id = ?
  `;
  db.query(sql, [returnDate, penalty, transactionId], callback);
};

// ✅ Decrease borrower's current_borrowed by 1
exports.restoreBorrowerCredit = (borrowerId, callback) => {
  const sql = `
    UPDATE borrowers
    SET current_borrowed = current_borrowed - 1
    WHERE id = ?
  `;
  db.query(sql, [borrowerId], callback);
};

// ✅ Get transaction with related book and borrower data
exports.getTransactionDetails = (transactionId, callback) => {
  const sql = `
    SELECT 
      bt.*, 
      b.penalty_per_day,
      br.current_borrowed
    FROM 
      borrow_transactions bt
    JOIN 
      books b ON bt.book_id = b.id
    JOIN 
      borrowers br ON bt.borrower_id = br.id
    WHERE 
      bt.id = ?
  `;
  db.query(sql, [transactionId], callback);
};


// 🔹 Get all transactions with book & borrower details
exports.getTransactions = (callback) => {
  const sql = `
    SELECT 
      bt.*, 
      b.title AS book_title, 
      br.full_name AS borrower_name
    FROM 
      borrow_transactions bt
    JOIN 
      books b ON bt.book_id = b.id
    JOIN 
      borrowers br ON bt.borrower_id = br.id
    ORDER BY 
      bt.borrow_date DESC
  `;
  db.query(sql, callback);
};

// 🔹 Most Borrowed Books
exports.getMostBorrowedBooks = (callback) => {
  const sql = `
    SELECT 
      b.id,
      b.title,
      COUNT(bt.book_id) AS times_borrowed
    FROM 
      borrow_transactions bt
    JOIN 
      books b ON bt.book_id = b.id
    GROUP BY 
      bt.book_id
    ORDER BY 
      times_borrowed DESC
  `;
  db.query(sql, callback);
};


// 🔹 Users with Overdue Books (returned late OR still overdue)
exports.getUsersWithOverdueBooks = (callback) => {
  const sql = `
    SELECT 
      br.id AS borrower_id,
      br.full_name,
      b.title AS book_title,
      bt.borrow_date,
      bt.due_date,
      bt.return_date,
      DATEDIFF(
        IF(bt.return_date IS NULL, CURDATE(), bt.return_date),
        bt.due_date
      ) AS overdue_days
    FROM 
      borrow_transactions bt
    JOIN 
      borrowers br ON bt.borrower_id = br.id
    JOIN 
      books b ON bt.book_id = b.id
    WHERE 
      (
        (bt.return_date IS NULL AND bt.due_date < CURDATE()) -- still not returned and past due
        OR 
        (bt.return_date IS NOT NULL AND bt.return_date > bt.due_date) -- returned late
      )
  `;
  db.query(sql, callback);
};

// 🔹 Average Borrowing Duration Per Book
exports.getAverageBorrowDuration = (callback) => {
  const sql = `
    SELECT 
      b.id,
      b.title,
      AVG(DATEDIFF(bt.return_date, bt.borrow_date)) AS average_days
    FROM 
      borrow_transactions bt
    JOIN 
      books b ON bt.book_id = b.id
    WHERE 
      bt.return_date IS NOT NULL
    GROUP BY 
      bt.book_id
    ORDER BY 
      average_days DESC
  `;
  db.query(sql, callback);
};



// 🔹 Get Borrower by ID
exports.getBorrowerById = (borrower_id, callback) => {
  const sql = `SELECT * FROM borrowers WHERE id = ?`;
  db.query(sql, [borrower_id], callback);
};

// 🔹 Add Transaction
exports.addTransactions = (data, callback) => {
  const sql = `
    INSERT INTO borrow_transactions (borrower_id, book_id, borrow_date, due_date, return_date, penalty_paid)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.borrower_id,
    data.book_id,
    data.borrow_date,
    data.due_date,
    data.return_date,
    data.penalty_paid
  ];
  db.query(sql, values, callback);
};

// 🔹 Increase borrower's current borrowed count
exports.incrementBorrowedBooks = (borrower_id, callback) => {
  const sql = `
    UPDATE borrowers SET current_borrowed = current_borrowed + 1 WHERE id = ?
  `;
  db.query(sql, [borrower_id], callback);
};

// 🔹 Delete a transaction by ID
exports.deleteTransactions = (id, callback) => {
  const sql = 'DELETE FROM borrow_transactions WHERE id = ?';
  db.query(sql, [id], callback);
};

// 🔹 Update a transaction by ID
exports.updateTransactions = (id, data, callback) => {
  const sql = `
    UPDATE borrow_transactions
    SET borrower_id = ?, book_id = ?, borrow_date = ?, due_date = ?, return_date = ?, penalty_paid = ?
    WHERE id = ?
  `;
  const values = [
    data.borrower_id,
    data.book_id,
    data.borrow_date,
    data.due_date,
    data.return_date,
    data.penalty_paid,
    id
  ];
  db.query(sql, values, callback);
};
