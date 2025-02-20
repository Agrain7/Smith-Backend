// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySuperSecretKey123!');
      req.user = decoded; // 예: { username: 'purplekir', iat: ..., exp: ... }
      next();
    } catch (error) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } else {
    return res.status(401).json({ message: '인증 토큰이 제공되지 않았습니다.' });
  }
}

module.exports = authMiddleware;
