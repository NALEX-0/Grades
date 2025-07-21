const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * JWT authentication middleware
 * Verifies token and attaches user to the request.
 * 
 * @function authenticateToken
 * @route Middleware
 * @header {string} Authorization - Bearer token
 * @returns 401 - Missing or invalid token
 * @returns 200 - Attaches authenticated user to req.user
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Expecting Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;
