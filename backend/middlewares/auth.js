const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const SECRET_KEY = process.env.JWT_SECRET || 'APINGANTENG';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Token tidak ditemukan',
      redirect: '/'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded token:', decoded); // Debug log
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('JWT verification error:', err); // Debug log
    return res.status(401).json({ 
      message: 'Token tidak valid',
      redirect: '/'
    });
  }
}

module.exports = authMiddleware;
