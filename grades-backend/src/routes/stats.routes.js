const express = require('express');
const router = express.Router();
const { 
    getUserAverage,
    getUserFullDistribution,
} = require('../controllers/stats.controller');

const authenticateToken = require('../middleware/auth.middleware');

// GET /api/stats/average - Get user's overall average stats
router.get('/average', authenticateToken, getUserAverage);

// GET /api/stats/full-distribution - Get user's full grades distribution
router.get('/full-distribution', authenticateToken, getUserFullDistribution);

module.exports = router;
