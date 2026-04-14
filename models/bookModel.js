// Detailed data storage for demonstration
const { db } = require('../config/firebase');

module.exports = {
  getFeatured: async () => {
    try {
      const snapshot = await db.collection('books').where('isFeatured', '==', true).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Firestore Error:', e);
      return [];
    }
  },
  getBorrowing: async (userId) => {
    if (!userId) return [];
    try {
      const snapshot = await db.collection('transactions')
        .where('userId', '==', userId)
        .where('status', 'in', ['Active', 'Borrowed', 'Overdue'])
        .get();
      
      const transactions = snapshot.docs.map(doc => ({ 
          id: doc.data().bookId, 
          transId: doc.id, 
          ...doc.data() 
      }));
      
      const now = new Date();
      return transactions.map(tx => {
          const dueDateObj = tx.dueDate.toDate ? tx.dueDate.toDate() : new Date(tx.dueDate);
          const borrowDateObj = tx.date.toDate ? tx.date.toDate() : new Date(tx.date);
          const diffTime = dueDateObj - now;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return {
            ...tx,
            title: tx.bookTitle,
            borrowDate: borrowDateObj.toLocaleDateString('vi-VN'),
            dueDate: dueDateObj.toLocaleDateString('vi-VN'),
            daysLeft: Math.max(0, diffDays),
            daysOverdue: Math.max(0, -diffDays),
            status: tx.status === 'Active' ? 'Active' : (diffDays < 0 ? 'Overdue' : 'Borrowed'),
            id_code: `LIB-${(tx.bookId || '').substring(0, 5).toUpperCase()}`
          };
      });
    } catch (e) {
      console.error('getBorrowing Error:', e);
      return [];
    }
  },
  getHistory: async (userId) => {
    if (!userId) return [];
    try {
      const snapshot = await db.collection('transactions')
        .where('userId', '==', userId)
        .get();
      
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort manually by date desc
      docs.sort((a, b) => {
          const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
      });
      
      return docs.map(data => {
        const borrowDate = (data.date && data.date.toDate) ? data.date.toDate() : new Date(data.date || Date.now());
        const dueDate = (data.dueDate && data.dueDate.toDate) ? data.dueDate.toDate() : new Date(data.dueDate || Date.now());
        
        return { 
          id: data.id, 
          ...data,
          title: data.bookTitle,
          borrowDate: borrowDate.toLocaleDateString('vi-VN'), 
          dueDate: dueDate.toLocaleDateString('vi-VN'),
          returnDate: data.returnDate || 'Dự kiến: ' + dueDate.toLocaleDateString('vi-VN')
        };
      });
    } catch (e) {
      console.error('getHistory Error:', e);
      return [];
    }
  },
  getTransactions: async (search = '') => {
    try {
      let query = db.collection('transactions');
      
      if (search) {
          // Note: Firestore searching is limited on free tier without specialized indexing, 
          // but we can at least try to search by slipCode or userId if they match exactly or startsWith
          // For this assignment, we use where() for at least one field to show "server-side" filtering.
          // Searching both fields at once in Firestore requires composite indexes.
          // We'll prioritize searching by slipCode (Uppercase) as it's the primary reference.
          query = query.where('slipCode', '==', search.toUpperCase());
      } else {
          query = query.orderBy('date', 'desc');
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              ...data,
              date: data.date.toDate ? data.date.toDate().toLocaleDateString('vi-VN') : new Date(data.date).toLocaleDateString('vi-VN'),
              dueDate: data.dueDate.toDate ? data.dueDate.toDate().toLocaleDateString('vi-VN') : new Date(data.dueDate).toLocaleDateString('vi-VN')
          };
      });
    } catch (e) {
      console.error('getTransactions Error:', e);
      return [];
    }
  },
  getUsers: async () => {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getAdminStats: async () => {
    const booksCount = (await db.collection('books').count().get()).data().count;
    const usersCount = (await db.collection('users').count().get()).data().count;
    const activeBorrows = (await db.collection('transactions').where('status', '==', 'Active').count().get()).data().count;
    const overdueCount = (await db.collection('books').where('status', '==', 'Overdue').count().get()).data().count;
    
    // Virtual storage calculation (max 16,000)
    const storagePercent = Math.min(Math.round((booksCount / 16000) * 100), 100);

    return {
      pendingRequests: 0, 
      borrowingCount: activeBorrows, 
      overdueCount: overdueCount,
      totalBooks: booksCount,
      totalUsers: usersCount,
      storageUsed: storagePercent || 1 // Min 1% for UI
    };
  },
  getNewArrivals: async () => {
    const snapshot = await db.collection('books').limit(3).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getAll: async () => {
    const snapshot = await db.collection('books').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getById: async (id) => {
    const doc = await db.collection('books').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },
  getTransactionById: async (id) => {
    const doc = await db.collection('transactions').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },
  addBook: async (bookData) => {
    const docRef = await db.collection('books').add({
      ...bookData,
      rating: 5.0,
      reviews: 0,
      quantity: parseInt(bookData.quantity) || 1,
      totalQuantity: parseInt(bookData.quantity) || 1,
      createdAt: new Date()
    });
    return docRef.id;
  },
  updateBook: async (id, data) => {
    const bookRef = db.collection('books').doc(id);
    await bookRef.update({
        ...data,
        quantity: parseInt(data.quantity) || 1,
        totalQuantity: parseInt(data.totalQuantity) || parseInt(data.quantity) || 1,
        updatedAt: new Date()
    });
  },
  deleteBook: async (id) => {
    await db.collection('books').doc(id).delete();
  },
  getBooksByCategory: async () => {
    const snapshot = await db.collection('books').get();
    const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const grouped = {};
    books.forEach(book => {
        const cat = book.category || 'Khác';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(book);
    });
    return grouped;
  },
  searchBooks: async (query) => {
    if (!query) return [];
    try {
      const snapshot = await db.collection('books').get();
      const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const q = query.toLowerCase();
      return allBooks.filter(book => 
          (book.title && book.title.toLowerCase().includes(q)) ||
          (book.author && book.author.toLowerCase().includes(q)) ||
          (book.category && book.category.toLowerCase().includes(q))
      );
    } catch (e) {
      console.error('searchBooks Error:', e);
      return [];
    }
  },
  getRelatedBooks: async (category, excludeId) => {
    if (!category) return [];
    try {
      const snapshot = await db.collection('books')
          .where('category', '==', category)
          .limit(6)
          .get();
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return books.filter(b => b.id !== excludeId).slice(0, 4);
    } catch (e) {
      console.error('getRelatedBooks Error:', e);
      return [];
    }
  },
  getUserStats: async (userId) => {
    if (!userId) return { readCount: 0, borrowingCount: 0 };
    try {
      const borrowingCount = (await db.collection('transactions')
        .where('userId', '==', userId)
        .where('status', '==', 'Active')
        .count().get()).data().count;
      
      const readCount = (await db.collection('transactions')
        .where('userId', '==', userId)
        .where('status', '==', 'Returned')
        .count().get()).data().count;

      return { readCount, borrowingCount };
    } catch (e) {
      console.error('getUserStats Error:', e);
      return { readCount: 0, borrowingCount: 0 };
    }
  },
  generateSlipCode: () => {
    return 'SLP' + Math.random().toString(36).substring(2, 8).toUpperCase();
  },
  borrowBook: async (bookId, userId, returnDate) => {
    if (!bookId || !userId) throw new Error('Missing book ID or user ID');
    
    // Rule 1: Max 10 books per user (counting Active, Borrowed, and Overdue)
    const currentBorrowsCount = (await db.collection('transactions')
        .where('userId', '==', userId)
        .where('status', 'in', ['Active', 'Borrowed', 'Overdue'])
        .count().get()).data().count;
    
    if (currentBorrowsCount >= 10) {
        throw new Error('Bạn đã đạt giới hạn mượn 10 cuốn sách. Vui lòng trả bớt sách trước khi mượn thêm.');
    }

    // Rule 2: Each user can only borrow 1 copy of the same book
    const existingBorrow = await db.collection('transactions')
        .where('userId', '==', userId)
        .where('bookId', '==', bookId)
        .where('status', '==', 'Active')
        .limit(1).get();
    
    if (!existingBorrow.empty) {
        throw new Error('Bạn đang mượn một cuốn sách này rồi. Mỗi loại sách chỉ được mượn 1 cuốn.');
    }

    const bookRef = db.collection('books').doc(bookId);
    
    return await db.runTransaction(async (transaction) => {
        const bookDoc = await transaction.get(bookRef);
        if (!bookDoc.exists) throw new Error('Sách không tồn tại');
        
        const data = bookDoc.data();
        const quantity = data.quantity || 0;
        
        if (quantity <= 0) {
            throw new Error('Sách hiện đã hết trong kho.');
        }

        const now = new Date();
        const dueDate = new Date();
        dueDate.setDate(now.getDate() + 14);

        // Update book quantity
        transaction.update(bookRef, {
            quantity: quantity - 1,
            status: (quantity - 1 === 0) ? 'Borrowed' : 'Available'
        });

        // Create transaction (Borrow Slip)
        const transRef = db.collection('transactions').doc();
        const slipCode = 'SLP' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        transaction.set(transRef, {
            userId: userId,
            bookId: bookId,
            slipCode: slipCode,
            bookTitle: data.title,
            cover: data.cover,
            userName: (await db.collection('users').doc(userId).get()).data().name || 'Sinh viên',
            type: 'Borrow',
            date: now,
            dueDate: new Date(returnDate),
            status: 'Active',
            createdAt: now
        });

        return transRef.id;
    });
  },
  updateUser: async (userId, data) => {
    await db.collection('users').doc(userId).update({
        ...data,
        updatedAt: new Date()
    });
    // Fetch updated user to return
    const doc = await db.collection('users').doc(userId).get();
    return { id: doc.id, ...doc.data() };
  },
  updateTransactionStatus: async (transactionId, status, feeData = {}) => {
    try {
      const transRef = db.collection('transactions').doc(transactionId);
      
      return await db.runTransaction(async (transaction) => {
          const transDoc = await transaction.get(transRef);
          if (!transDoc.exists) throw new Error('Phiếu mượn không tồn tại');
          
          const transData = transDoc.data();
          const oldStatus = transData.status;

          const activeStatuses = ['Active', 'Borrowed', 'Overdue'];
          const inactiveStatuses = ['Returned', 'Cancelled'];

          // Return to inventory if moving from active to inactive
          if (inactiveStatuses.includes(status) && activeStatuses.includes(oldStatus)) {
              const bookRef = db.collection('books').doc(transData.bookId);
              const bookDoc = await transaction.get(bookRef);
              
              if (bookDoc.exists) {
                  const bookData = bookDoc.data();
                  transaction.update(bookRef, {
                      quantity: (bookData.quantity || 0) + 1,
                      status: 'Available'
                  });
              }
          }

          const updateData = { 
              status,
              updatedAt: new Date()
          };

          // If returning, record fees and condition
          if (status === 'Returned') {
              updateData.lateFee = parseInt(feeData.lateFee) || 0;
              updateData.damageFee = parseInt(feeData.damageFee) || 0;
              updateData.totalFee = updateData.lateFee + updateData.damageFee;
              updateData.condition = feeData.condition || 'Nguyên vẹn';
              updateData.returnDateActual = new Date();
          }

          transaction.update(transRef, updateData);

          return true;
      });
    } catch (e) {
      console.error('updateTransactionStatus Error:', e);
      return false;
    }
  },
  renewTransaction: async (transactionId, newDueDate) => {
    try {
      const transRef = db.collection('transactions').doc(transactionId);
      const doc = await transRef.get();
      if (!doc.exists) throw new Error('Không tìm thấy phiếu mượn');
      
      const now = new Date();
      const dueDate = new Date(newDueDate);
      
      // Basic validation: new date must be in the future
      if (dueDate <= now) throw new Error('Ngày trả mới phải sau ngày hôm nay');
      
      await transRef.update({
          dueDate: dueDate,
          updatedAt: now
      });
      return true;
    } catch (e) {
      console.error('renewTransaction Error:', e);
      throw e;
    }
  }
};
