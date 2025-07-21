const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Register a new user.
 * @route POST /api/users/register
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (plain text)
 * @returns 201 - Created user (id, name, email)
 * @returns 400 - Missing fields or invalid password
 * @returns 409 - Email already in use
 * @returns 500 - Server error
 */
async function registerUser(req, res) {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}

/**
 * Log in an existing user.
 * @route POST /api/users/login
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (plain text)
 * @returns 200 - JWT token and user info
 * @returns 400 - Missing credentials
 * @returns 401 - Invalid credentials
 * @returns 500 - Server error
 */
async function loginUser(req, res) {
  const email = req.body.email?.trim();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * Get current authenticated user
 * @route GET /api/users/me
 */
function getCurrentUser(req, res) {
  return res.status(200).json(req.user);
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
