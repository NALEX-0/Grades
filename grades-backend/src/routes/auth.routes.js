const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getCurrentUser } = require('../controllers/auth.controller');


const authenticateToken = require('../middleware/auth.middleware');

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

// GET /api/users/me
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
