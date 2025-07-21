const express = require('express');
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getPassedCoursesGroupedBySemester,
  getCourseById,
  updateCourse,
  searchCourses,
  deleteCourse,
} = require('../controllers/course.controller');

const authenticateToken = require('../middleware/auth.middleware');

// POST /api/courses
router.post('/', authenticateToken, createCourse);

// GET /api/courses/search
router.get('/search', authenticateToken, searchCourses);

// GET /api/courses
router.get('/', authenticateToken, getAllCourses);

// GET /api/courses/passed
router.get('/passed', authenticateToken, getPassedCoursesGroupedBySemester);

// GET /api/courses/:id
router.get('/:id', authenticateToken, getCourseById);

// PUT /api/courses/:id
router.put('/:id', authenticateToken, updateCourse);

// DELETE /api/courses/:id
router.delete('/:id', authenticateToken, deleteCourse);

module.exports = router;
