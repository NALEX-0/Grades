const express = require('express');
const router = express.Router();

const {
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createCourse,
  searchCourses,
  getPassedCoursesGroupedBySemester,
  getCourseSummary,
  getCourseGradesGraph,
  getCourseGradesTable,
} = require('../controllers/course.controller');

const authenticateToken = require('../middleware/auth.middleware');

// GET /api/courses
router.get('/', authenticateToken, getAllCourses);

// GET /api/courses/passed
router.get('/passed', authenticateToken, getPassedCoursesGroupedBySemester);

// GET /api/courses/search
router.get('/search', authenticateToken, searchCourses);

// GET /api/courses/:courseId/summary
router.get('/:courseId/summary', authenticateToken, getCourseSummary);

// GET /api/courses/:courseId/grades/graph
router.get('/:courseId/grades/graph', authenticateToken, getCourseGradesGraph);

// GET /api/courses/:courseId/grades
router.get('/:courseId/grades', authenticateToken, getCourseGradesTable);

// POST /api/courses
router.post('/', authenticateToken, createCourse);

// GET /api/courses/:id
router.get('/:id', authenticateToken, getCourseById);

// PUT /api/courses/:id
router.put('/:id', authenticateToken, updateCourse);

// DELETE /api/courses/:id
router.delete('/:id', authenticateToken, deleteCourse);

module.exports = router;
