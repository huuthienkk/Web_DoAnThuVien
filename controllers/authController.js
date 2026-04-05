const { auth, db } = require('../config/firebase');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Đăng nhập - Thư viện số' });
};

exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Đăng ký - Thư viện số' });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  
  // Hardcoded admin for demo purposes (matching .env)
  if (email === process.env.ADMIN_EMAIL && password === 'admin123') {
    req.session.user = { 
        id: 'ADMIN',
        email, 
        role: 'admin', 
        name: 'Quản trị viên' 
    };
    return res.redirect('/admin/dashboard');
  }

  try {
    // In a real app, you'd use Firebase Auth Client SDK on the frontend
    // and verify the ID token here. For this demo, we'll simulate user login.
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      req.session.user = { email, role: 'user', id: userSnapshot.docs[0].id, ...userData };
      return res.redirect('/');
    }
    
    req.flash('error_msg', 'Email hoặc mật khẩu không chính xác');
    res.redirect('/login');
  } catch (e) {
    req.flash('error_msg', 'Lỗi hệ thống: ' + e.message);
    res.redirect('/login');
  }
};

exports.postRegister = async (req, res) => {
  const { fullname, studentid, email, password } = req.body;
  
  try {
    // Check if student ID already exists
    const existingUser = await db.collection('users').doc(studentid).get();
    if (existingUser.exists) {
        req.flash('error_msg', 'Mã sinh viên này đã được đăng ký!');
        return res.redirect('/register');
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullname
    });

    // Use studentid as the Document ID!
    const userData = {
      uid: userRecord.uid,
      name: fullname,
      studentid,
      email,
      role: 'user',
      status: 'Active',
      dept: 'Kỹ thuật Phần mềm',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
      createdAt: new Date()
    };

    await db.collection('users').doc(studentid).set(userData);

    req.flash('success_msg', 'Đăng ký thành công! Vui lòng đăng nhập.');
    res.redirect('/login');
  } catch (e) {
    req.flash('error_msg', 'Đăng ký thất bại: ' + e.message);
    res.redirect('/register');
  }
};
