const express = require('express');
const router = express.Router();

const {
  createExamination,
  getAllExaminations,
  getExaminationById,
  getExaminationByName,
  searchExaminations,
  updateExamination
} = require('../controllers/examination.controller');

const authenticateToken = require('../middleware/auth.middleware');

// POST /api/examinations
router.post('/', authenticateToken, createExamination);

// GET /api/examinations/search
router.get('/search', authenticateToken, searchExaminations);

// GET /api/examinations
router.get('/', authenticateToken, getAllExaminations);

// GET /api/examinations/:id
router.get('/:id', authenticateToken, getExaminationById);

// GET /api/examinations/name/:name
router.get('/name/:name', authenticateToken, getExaminationByName);

// PUT /api/examinations/:id
router.put('/:id', authenticateToken, updateExamination);

module.exports = router;
