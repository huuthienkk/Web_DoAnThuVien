module.exports = (req, res, next) => {
  // Simple session-based auth check
  if (req.session && req.session.user) {
    if (req.session.user.role === 'admin') {
      return next();
    }
    req.flash('error_msg', 'Quyền truy cập bị từ chối: Chỉ dành cho Thủ thư');
    return res.redirect('/');
  }
  
  // Redirect to login if not authenticated
  res.redirect('/login');
};
