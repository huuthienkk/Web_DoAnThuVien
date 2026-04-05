const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.getDashboard);
router.get('/transactions', adminController.getTransactions);
router.get('/users', adminController.getUsers);
router.get('/statistics', adminController.getStatistics);
router.get('/add-book', adminController.getAddBook);
router.post('/add-book', adminController.postAddBook);
router.get('/edit-book/:id', adminController.getEditBook);
router.post('/edit-book/:id', adminController.postEditBook);
router.post('/update-transaction-status', adminController.postUpdateTransactionStatus);
router.get('/delete-book/:id', adminController.deleteBook);

module.exports = router;
