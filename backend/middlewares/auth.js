const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'APIN_SUKA_MAKAN_PISANG_UU_AA_UU_AA');
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
}

module.exports = authMiddleware;
