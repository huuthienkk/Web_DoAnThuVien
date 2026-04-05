const bookModel = require('../models/bookModel');

exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await bookModel.getAdminStats();
    const groupedBooks = await bookModel.getBooksByCategory();
    res.render('admin/dashboard', { 
      title: 'Kho sách', 
      stats, 
      groupedBooks
    });
  } catch (e) {
    next(e);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { search } = req.query;
    let transactions = await bookModel.getTransactions(search);

    const stats = await bookModel.getAdminStats();
    res.render('admin/transactions', { 
      title: 'Quản lý Phiếu mượn', 
      transactions,
      stats,
      search: search || ''
    });
  } catch (e) {
    next(e);
  }
};

exports.postUpdateTransactionStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body;
        const success = await bookModel.updateTransactionStatus(id, status);
        
        if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
            return res.json({ success, message: success ? 'Cập nhật thành công' : 'Không thể cập nhật' });
        }
        
        res.redirect('/admin/transactions');
    } catch (e) {
        if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
            return res.status(500).json({ success: false, message: e.message });
        }
        next(e);
    }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await bookModel.getUsers();
    const stats = await bookModel.getAdminStats();
    res.render('admin/users', { 
      title: 'Quản lý Người dùng', 
      users,
      stats
    });
  } catch (e) {
    next(e);
  }
};

exports.getAddBook = async (req, res, next) => {
  try {
    const stats = await bookModel.getAdminStats();
    res.render('admin/add-book', { 
      title: 'Thêm tài liệu mới', 
      stats 
    });
  } catch (e) {
    next(e);
  }
};

exports.postAddBook = async (req, res, next) => {
  try {
    const { title, author, category, status, cover, isFeatured, quantity } = req.body;
    const featured = isFeatured === 'on';
    const parsedQuantity = parseInt(quantity) || 1;
    if (parsedQuantity < 0) {
        req.flash('error_msg', 'Số lượng không thể là số âm');
        return res.redirect('/admin/add-book');
    }
    
    const bookData = {
      title,
      author,
      category,
      status: status || 'Available',
      cover: cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400',
      isFeatured: featured,
      quantity: parsedQuantity
    };
    await bookModel.addBook(bookData);
    req.flash('success_msg', 'Thêm sách mới thành công!');
    res.redirect('/admin/dashboard');
  } catch (e) {
    req.flash('error_msg', 'Lỗi khi thêm sách: ' + e.message);
    res.redirect('/admin/add-book');
  }
};

exports.getEditBook = async (req, res, next) => {
  try {
    const book = await bookModel.getById(req.params.id);
    const stats = await bookModel.getAdminStats();
    res.render('admin/edit-book', { title: 'Sửa tài liệu', book, stats });
  } catch (e) {
    next(e);
  }
};

exports.postEditBook = async (req, res, next) => {
  try {
    const { title, author, category, quantity, totalQuantity, cover, isFeatured } = req.body;
    const q = parseInt(quantity);
    const tq = parseInt(totalQuantity) || q;
    if (q < 0 || tq < 0) {
        req.flash('error_msg', 'Số lượng không thể là số âm');
        return res.redirect(`/admin/edit-book/${req.params.id}`);
    }
    if (q > tq) {
        req.flash('error_msg', 'Số lượng hiện có không thể lớn hơn tổng số lượng');
        return res.redirect(`/admin/edit-book/${req.params.id}`);
    }

    await bookModel.updateBook(req.params.id, {
        title, author, category, 
        quantity: q, 
        totalQuantity: tq,
        cover, 
        isFeatured: isFeatured === 'on' 
    });
    req.flash('success_msg', 'Cập nhật sách thành công!');
    res.redirect('/admin/dashboard');
  } catch (e) {
    req.flash('error_msg', 'Lỗi khi cập nhật sách: ' + e.message);
    res.redirect(`/admin/edit-book/${req.params.id}`);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    await bookModel.deleteBook(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (e) {
    next(e);
  }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await bookModel.getAdminStats();
    const transactions = await bookModel.getTransactions();
    res.render('admin/statistics', { 
        title: 'Thống kê hệ thống', 
        stats,
        transactions
    });
  } catch (e) {
    next(e);
  }
};
