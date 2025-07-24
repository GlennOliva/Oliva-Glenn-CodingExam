const express = require('express');
const router = express.Router();
const controller = require('../Controller/BorrowerController');

router.get('/', controller.getBorrower);
router.post('/', controller.addBorrower);
router.delete('/:id', controller.deleteBorrower);

// ✅ Update route
router.put('/:id', controller.updateBorrower);

module.exports = router;
    