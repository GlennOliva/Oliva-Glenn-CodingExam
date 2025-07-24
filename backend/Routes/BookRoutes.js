const express = require('express');
const router = express.Router();
const controller = require('../Controller/BooksController');

router.get('/', controller.getBooks);
router.post('/', controller.addBooks);
router.delete('/:id', controller.deleteBooks);

// ✅ Update route
router.put('/:id', controller.updateBooks);

module.exports = router;
    