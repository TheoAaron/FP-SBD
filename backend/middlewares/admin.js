function adminMiddleware(req, res, next) {

  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required',
      redirect: '/'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin role required.',
      redirect: '/'
    });
  }

  console.log('Admin access granted for user:', req.user.id);
  next();
}

module.exports = adminMiddleware;
