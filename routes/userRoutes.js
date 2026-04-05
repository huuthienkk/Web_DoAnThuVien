const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getIndex);
router.get('/borrowing', bookController.getBorrowing);
router.get('/history', bookController.getHistory);
router.get('/profile', bookController.getProfile);
router.get('/book/:id', bookController.getBookDetails);
router.get('/borrow/slip/:id', bookController.getCreateSlip);
router.post('/borrow/confirm/:id', bookController.postConfirmSlip);
router.post('/profile', bookController.postUpdateProfile);
router.get('/renew/:id', bookController.getRenew);
router.post('/renew/:id', bookController.postRenew);

module.exports = router;
