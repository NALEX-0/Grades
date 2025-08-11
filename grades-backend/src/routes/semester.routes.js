const express = require('express');
const router = express.Router();

const {
  createSemester,
  getAllSemesters,
  getSemesterByName,
  searchSemesters,
  updateSemester,
  deleteSemester,
} = require('../controllers/semester.controller');

const authenticateToken = require('../middleware/auth.middleware');

// POST /api/semesters
router.post('/', authenticateToken, createSemester);

// GET /api/semesters/search
router.get('/search', authenticateToken, searchSemesters);

// GET /api/semesters/:name
router.get('/:name', authenticateToken, getSemesterByName);

// GET /api/semesters
router.get('/', authenticateToken, getAllSemesters);

// PUT /api/semesters/:id
router.put('/:id', authenticateToken, updateSemester);

// DELETE /api/semesters/:id
router.delete('/:id', authenticateToken, deleteSemester);

module.exports = router;
