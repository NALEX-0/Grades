const express = require('express');
const router = express.Router();

const {
  createGrade,
  getUserGrades,
  updateGrade,
  deleteGrade,
} = require('../controllers/grade.controller');

const authenticateToken = require('../middleware/auth.middleware');

// POST /api/grades - Create a grade
router.post('/', authenticateToken, createGrade);

// GET /api/grades - Get grades for current user
router.get('/', authenticateToken, getUserGrades);

// PUT /api/grades/:id - Update a grade (score or exam)
router.put('/:id', authenticateToken, updateGrade);

// DELETE /api/grades/:id - Delete a grade
router.delete('/:id', authenticateToken, deleteGrade);

module.exports = router;
