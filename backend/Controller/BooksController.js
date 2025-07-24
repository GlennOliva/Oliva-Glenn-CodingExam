const Books = require('../Models/BooksModel');

// Get all books
exports.getBooks = (req, res) => {
    Books.getBooks( (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.addBooks = (req, res) => {
  const { title, author, total_copies, available_copies, penalty_per_day } = req.body;

  const booksData = {
    title,
    author,
    total_copies,
    available_copies,
    penalty_per_day
  };

  Books.addBooks(booksData, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Books Successfully Inserted', id: result.insertId });
  });
};


// Delete books
exports.deleteBooks = (req, res) => {
  Books.deleteBooks(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Books  deleted!' });
  });
};

exports.updateBooks = (req, res) => {
  const id = req.params.id;
  const { title, author, total_copies, available_copies, penalty_per_day } = req.body;

  const booksData = {
    title,
    author,
    total_copies,
    available_copies,
    penalty_per_day
  };

  Books.updateBooks(id, booksData, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Books not found' });
    }

    res.json({ message: 'Books updated successfully!' });
  });
};
