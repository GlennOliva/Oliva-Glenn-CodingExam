const Borrower = require('../Models/BorrowerModel');

// ✅ Get all borrowers
exports.getBorrower = (req, res) => {
  Borrower.getBorrower((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ✅ Add a borrower
exports.addBorrower = (req, res) => {
  const { full_name, max_books_allowed, current_borrowed } = req.body;

  const borrowerData = {
    full_name,
    max_books_allowed,
    current_borrowed
  };

  Borrower.addBorrower(borrowerData, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Borrower successfully inserted', id: result.insertId });
  });
};

// ✅ Delete borrower
exports.deleteBorrower = (req, res) => {
  Borrower.deleteBorrower(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Borrower deleted!' });
  });
};

// ✅ Update borrower
exports.updateBorrower = (req, res) => {
  const id = req.params.id;
  const { full_name, max_books_allowed, current_borrowed } = req.body;

  const borrowerData = {
    full_name,
    max_books_allowed,
    current_borrowed
  };

  Borrower.updateBorrower(id, borrowerData, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    res.json({ message: 'Borrower updated successfully!' });
  });
};
