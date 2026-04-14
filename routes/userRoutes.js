const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getIndex);
router.get('/borrowing', bookController.getBorrowing);
router.get('/history', bookController.getHistory);
router.get('/profile', bookController.getProfile);
router.get('/book/:id', bookController.getBookDetails);
router.get('/borrow/slip/:id', bookController.getCreateSlip);
router.get('/borrow/print/:id', bookController.getPrintSlip);
router.post('/borrow/confirm/:id', bookController.postConfirmSlip);
router.post('/profile', bookController.postUpdateProfile);
router.get('/renew/:id', bookController.getRenew);
router.post('/renew/:id', bookController.postRenew);
router.get('/api/search', bookController.getApiSearch);

module.exports = router;
