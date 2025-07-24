const Transactions = require('../Models/TransactionModel');




exports.returnBook = (req, res) => {
  const transactionId = req.params.id;

  const returnDate = req.body?.return_date
    ? new Date(req.body.return_date)
    : new Date(); // fallback to today

  Transactions.getTransactionDetails(transactionId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Transaction not found' });

    const transaction = results[0];
    const dueDate = new Date(transaction.due_date);
    const penaltyRate = parseFloat(transaction.penalty_per_day);

    const daysLate = Math.max(0, Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)));
    const penalty = daysLate * penaltyRate;

    Transactions.markAsReturned(transactionId, returnDate, penalty, (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      Transactions.restoreBorrowerCredit(transaction.borrower_id, (err3) => {
        if (err3) return res.status(500).json({ error: err3 });

        res.json({
          message: 'Book returned successfully',
          days_late: daysLate,
          penalty_paid: penalty
        });
      });
    });
  });
};



// ✅ Get all transactions
exports.getTransactions = (req, res) => {
  Transactions.getTransactions((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getMostBorrowedBooks = (req, res) => {
  Transactions.getMostBorrowedBooks((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getUsersWithOverdueBooks = (req, res) => {
  Transactions.getUsersWithOverdueBooks((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getAverageBorrowDuration = (req, res) => {
  Transactions.getAverageBorrowDuration((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


// ✅ Add a new transaction
exports.addTransactions = (req, res) => {
  const data = req.body;
  const { borrower_id, book_id, borrow_date, due_date } = data;

  // ✅ Check if borrower exists
  Transactions.getBorrowerById(borrower_id, (err, borrowerResult) => {
    if (err) return res.status(500).json({ error: err });

    if (borrowerResult.length === 0) {
      return res.status(400).json({ message: 'Borrower is not registered.' });
    }

    const borrower = borrowerResult[0];

    // ✅ Check if borrower has reached their limit
    if (borrower.current_borrowed >= borrower.max_books_allowed) {
      return res.status(400).json({
        message: 'Borrowing limit exceeded. Cannot borrow more books.'
      });
    }

    // ✅ Prepare transaction data
    const transactionData = {
      borrower_id,
      book_id,
      borrow_date,
      due_date,
      return_date: null,
      penalty_paid: 0
    };

    // ✅ Add transaction and update borrower
    Transactions.addTransactions(transactionData, (err2, result) => {
      if (err2) return res.status(500).json({ error: err2 });

      Transactions.incrementBorrowedBooks(borrower_id, (err3) => {
        if (err3) return res.status(500).json({ error: err3 });

        res.status(201).json({
          message: 'Book borrowed successfully.',
          transaction_id: result.insertId
        });
      });
    });
  });
};

// ✅ Delete a transaction
exports.deleteTransactions = (req, res) => {
  Transactions.deleteTransactions(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Transaction deleted!' });
  });
};

// ✅ Update a transaction
exports.updateTransactions = (req, res) => {
  const id = req.params.id;
  const {
    borrower_id,
    book_id,
    borrow_date,
    due_date,
    return_date,
    penalty_paid
  } = req.body;

  const transactionsData = {
    borrower_id,
    book_id,
    borrow_date,
    due_date,
    return_date,
    penalty_paid
  };

  Transactions.updateTransactions(id, transactionsData, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated successfully!' });
  });
};
