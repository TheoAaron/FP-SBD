function adminMiddleware(req, res, next) {
  // Admin middleware harus dijalankan setelah auth middleware
  // sehingga req.user sudah tersedia
  
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      redirect: '/'
    });
  }

  // Mengecek apakah user memiliki role admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin role required.',
      redirect: '/'
    });
  }

  console.log('Admin access granted for user:', req.user.id); // Debug log
  next();
}

module.exports = adminMiddleware;
