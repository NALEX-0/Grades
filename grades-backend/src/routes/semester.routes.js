const express = require('express');
const router = express.Router();

const {
  createSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
} = require('../controllers/semester.controller');

const authenticateToken = require('../middleware/auth.middleware');

// POST /api/semesters
router.post('/', authenticateToken, createSemester);

// GET /api/semesters
router.get('/', authenticateToken, getAllSemesters);

// GET /api/semesters/:id
router.get('/:id', authenticateToken, getSemesterById);

// PUT /api/semesters/:id
router.put('/:id', authenticateToken, updateSemester);

// DELETE /api/semesters/:id
router.delete('/:id', authenticateToken, deleteSemester);

module.exports = router;
