const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for demo simplicity with external images
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'green_library_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash Messages Configuration
app.use(flash());

// Global Variables for Templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes & Middlewares
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Public Auth Routes
app.use('/', authRoutes);

// Global Authentication Middleware
app.use((req, res, next) => {
  // Allow these public paths
  const publicPaths = ['/login', '/register', '/css', '/js', '/images', '/favicon.ico'];
  if (publicPaths.some(p => req.path.startsWith(p))) {
    return next();
  }

  // Check if user is logged in
  if (req.session.user) {
    res.locals.user = req.session.user; // Global user object for templates
    return next();
  }

  // Otherwise, redirect to login
  res.redirect('/login');
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login');
  });
});

// Protected Business Routes
app.use('/', userRoutes);
app.use('/admin', authMiddleware, adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Không tìm thấy trang', 
    message: 'Trang bạn tìm kiếm không tồn tại.' 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Lỗi hệ thống', 
    message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.' 
  });
});

app.listen(PORT, () => {
  console.log(`🌿 Green Library (Production Mode) is running on http://localhost:${PORT}`);
});
