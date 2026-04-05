const bookModel = require('../models/bookModel');

exports.getIndex = async (req, res) => {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    const query = req.query.q;
    
    let featuredBooks = [];
    let groupedBooks = {};
    const borrowingBooks = await bookModel.getBorrowing(userId);

    if (query) {
        // Search Mode
        featuredBooks = await bookModel.searchBooks(query);
    } else {
        // Normal Mode - Grouped by Category
        featuredBooks = await bookModel.getFeatured();
        groupedBooks = await bookModel.getBooksByCategory();
    }

    res.render('user/index', { 
      title: query ? `Tìm kiếm: ${query}` : 'Thư viện số - Trang chủ', 
      featuredBooks, 
      borrowingBooks,
      groupedBooks,
      searchQuery: query || ''
    });
  } catch (e) {
    req.flash('error_msg', 'Lỗi tải trang chủ: ' + e.message);
    res.redirect('/login');
  }
};

exports.getBorrowing = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null;
  const borrowingBooks = await bookModel.getBorrowing(userId);
  
  const totalCount = borrowingBooks.length;
  let earliestDueDate = 'N/A';
  let daysRemaining = null;

  if (totalCount > 0) {
    const sorted = [...borrowingBooks].sort((a, b) => (a.daysLeft || 999) - (b.daysLeft || 999));
    const earliest = sorted[0];
    earliestDueDate = earliest.dueDate;
    daysRemaining = earliest.daysLeft;
  }

  res.render('user/borrowing', { 
    title: 'Sách đang mượn', 
    borrowingBooks,
    summary: { totalCount, earliestDueDate, daysRemaining }
  });
};

exports.getHistory = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null;
  const history = await bookModel.getHistory(userId);
  res.render('user/history', { title: 'Lịch sử mượn trả', history });
};

exports.getBookDetails = async (req, res) => {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    const book = await bookModel.getById(req.params.id);
    if (!book) {
        req.flash('error_msg', 'Không tìm thấy sách!');
        return res.redirect('/');
    }
    
    let isAlreadyBorrowing = false;
    let hasReachedLimit = false;

    if (userId) {
        const borrowingBooks = await bookModel.getBorrowing(userId);
        isAlreadyBorrowing = borrowingBooks.some(b => b.id === req.params.id);
        hasReachedLimit = borrowingBooks.length >= 10;
    }

    if (!book.description) {
        book.description = 'Cuốn sách này cung cấp những kiến thức giá trị và trải nghiệm đọc tuyệt vời. Bạn hãy mượn để khám phá thêm nội dung chi tiết nhé!';
    }
    
    res.render('user/book-details', { 
        title: book.title, 
        book,
        isAlreadyBorrowing,
        hasReachedLimit
    });
  } catch (e) {
      req.flash('error_msg', 'Lỗi tải chi tiết sách: ' + e.message);
      res.redirect('/');
  }
};

exports.getCreateSlip = async (req, res) => {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    if (!userId) return res.redirect('/login');
    
    const book = await bookModel.getById(req.params.id);
    if (!book) {
        req.flash('error_msg', 'Không tìm thấy sách!');
        return res.redirect('/');
    }

    const slipCode = bookModel.generateSlipCode();
    
    res.render('user/create-slip', { 
        title: 'Tạo phiếu mượn', 
        book, 
        user: req.session.user,
        slipCode
    });
  } catch (e) {
      req.flash('error_msg', 'Lỗi: ' + e.message);
      res.redirect('back');
  }
};

exports.postConfirmSlip = async (req, res) => {
  try {
    const userId = req.session.user ? req.session.user.id : null;
    const { returnDate } = req.body;
    
    if (!userId) {
        req.flash('error_msg', 'Vui lòng đăng nhập');
        return res.redirect('/login');
    }
    if (!returnDate) {
        req.flash('error_msg', 'Vui lòng chọn ngày trả');
        return res.redirect('back');
    }
    
    await bookModel.borrowBook(req.params.id, userId, returnDate);
    req.flash('success_msg', 'Mượn sách thành công! Phiếu mượn đã được tạo.');
    res.redirect('/history'); // Redirect to history where the slip will be listed
  } catch (e) {
    req.flash('error_msg', 'Lỗi khi mượn sách: ' + e.message);
    res.redirect('back');
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null;
  if (!userId) return res.redirect('/login');
  
  const stats = await bookModel.getUserStats(userId);
  res.render('user/profile', { 
      title: 'Hồ sơ cá nhân', 
      stats,
      user: req.session.user
  });
};

exports.postUpdateProfile = async (req, res) => {
    try {
        const userId = req.session.user ? req.session.user.id : null;
        if (!userId) {
            req.flash('error_msg', 'Vui lòng đăng nhập');
            return res.redirect('/login');
        }

        let { name, avatar, dept } = req.body;
        
        // Basic Validation & Sanitization
        name = (name || '').trim().substring(0, 50);
        dept = (dept || '').trim().substring(0, 100);
        avatar = (avatar || '').trim();

        if (!name) {
            req.flash('error_msg', 'Tên không được để trống');
            return res.redirect('/profile');
        }
        
        // Simple URL Validation for Avatar
        if (avatar && !avatar.match(/^https?:\/\/.+/)) {
            req.flash('error_msg', 'Link Avatar không hợp lệ (phải bắt đầu bằng http:// hoặc https://)');
            return res.redirect('/profile');
        }

        const updatedUser = await bookModel.updateUser(userId, { name, avatar, dept });
        
        // Update session
        req.session.user = updatedUser;
        
        req.flash('success_msg', 'Cập nhật hồ sơ thành công!');
        res.redirect('/profile');
    } catch (e) {
        req.flash('error_msg', 'Lỗi cập nhật: ' + e.message);
        res.redirect('/profile');
    }
};

exports.getRenew = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await bookModel.getTransactionById(transactionId);
    
    if (!transaction) {
        req.flash('error_msg', 'Không tìm thấy phiếu mượn');
        return res.redirect('/borrowing');
    }

    // Security check: Don't allow renewal if overdue
    // Calculate if it's currently overdue
    const now = new Date();
    const dueDate = transaction.dueDate.toDate ? transaction.dueDate.toDate() : new Date(transaction.dueDate);
    if (now > dueDate) {
        req.flash('error_msg', 'Sách đã quá hạn, không thể tự gia hạn. Vui lòng liên hệ thủ thư.');
        return res.redirect('/borrowing');
    }
    
    // Format current due date for the view
    const currentDueDate = transaction.dueDate.toDate ? transaction.dueDate.toDate() : new Date(transaction.dueDate);
    
    res.render('user/renew', { 
        title: 'Gia hạn mượn sách', 
        transaction,
        currentDueDate: currentDueDate.toLocaleDateString('vi-VN')
    });
  } catch (e) {
    req.flash('error_msg', 'Lỗi: ' + e.message);
    res.redirect('/borrowing');
  }
};

exports.postRenew = async (req, res) => {
  try {
    const { newDueDate } = req.body;
    const transactionId = req.params.id;

    if (!newDueDate) {
        req.flash('error_msg', 'Vui lòng chọn ngày trả mới');
        return res.redirect(`/renew/${transactionId}`);
    }

    // Business Logic: Check if the new date is too far (e.g., max 30 days from now)
    const now = new Date();
    const selectedDate = new Date(newDueDate);
    const diffTime = selectedDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
        req.flash('error_msg', 'Thời gian gia hạn tối đa là 30 ngày kể từ hôm nay');
        return res.redirect(`/renew/${transactionId}`);
    }

    await bookModel.renewTransaction(transactionId, newDueDate);
    
    req.flash('success_msg', 'Gia hạn thành công! Ngày trả mới: ' + selectedDate.toLocaleDateString('vi-VN'));
    res.redirect('/borrowing');
  } catch (e) {
    req.flash('error_msg', 'Lỗi khi gia hạn: ' + e.message);
    res.redirect(`/renew/${req.params.id}`);
  }
};
