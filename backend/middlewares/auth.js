const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  console.log('Auth middleware running...');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  const authHeader = req.headers.authorization;
  const SECRET_KEY = process.env.JWT_SECRET || 'APINGANTENG';

  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({
      message: 'Token tidak ditemukan - Authorization header missing',
      redirect: '/'
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log('Authorization header does not start with Bearer');
    return res.status(401).json({
      message: 'Token tidak ditemukan - Bearer prefix missing',
      redirect: '/'
    });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token.substring(0, 15) + '...');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token verified successfully');
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({
      message: 'Token tidak valid: ' + err.message,
      redirect: '/'
    });
  }
}

module.exports = authMiddleware;
