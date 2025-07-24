const express = require('express');
const router = express.Router();
const controller = require('../Controller/TransactionController');

router.get('/', controller.getTransactions);
router.get('/most_borrowbooks', controller.getMostBorrowedBooks)
router.get('/get_user_overdue', controller.getUsersWithOverdueBooks)
router.get('/get_averageborrow', controller.getAverageBorrowDuration)
router.post('/', controller.addTransactions);
router.delete('/:id', controller.deleteTransactions);

// ✅ Update route
router.put('/:id', controller.updateTransactions);
router.put('/return/:id', controller.returnBook);


module.exports = router;
    