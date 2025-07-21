const prisma = require('../prisma/client');

/**
 * Create a new course.
 * @route POST /api/courses
 * @param {string} req.body.name - Course name
 * @param {number} req.body.semesterId - Associated semester ID
 * @returns 201 - Created course
 * @returns 400 - Missing fields or duplicate name
 * @returns 404 - Semester not found
 * @returns 500 - Server error
 */
async function createCourse(req, res) {
  const { name, semesterId } = req.body;

  if (!name || !semesterId) {
    return res.status(400).json({ error: 'Name and semesterId are required' });
  }

  try {
    const semester = await prisma.semester.findUnique({ where: { id: semesterId } });
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }

    const existing = await prisma.course.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Course with this name already exists' });
    }

    const course = await prisma.course.create({
      data: {
        name,
        semester: { connect: { id: semesterId } },
      },
    });

    return res.status(201).json({ course });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create course' });
  }
}

/**
 * Get all courses grouped by semester.
 * @route GET /api/courses
 * @returns 200 - Courses grouped by semester
 * @returns 500 - Server error
 */
async function getAllCourses(req, res) {
  try {
    const courses = await prisma.course.findMany({
      include: { semester: true },
    });

    const grouped = courses.reduce((acc, course) => {
      const semesterName = course.semester?.name || 'unspecified';
      if (!acc[semesterName]) {
        acc[semesterName] = [];
      }
      acc[semesterName].push(course);
      return acc;
    }, {});

    return res.status(200).json(grouped);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

/**
 * Get all passed courses grouped by semester.
 * @route GET /api/courses/passed
 * @returns 200 - Passed courses grouped by semester
 * @returns 500 - Server error
 */
async function getPassedCoursesGroupedBySemester(req, res) {
  const userId = req.user.id;

  try {
    const grades = await prisma.grade.findMany({
      where: {
        userId,
        score: {
          gte: 5,
        },
      },
      include: {
        course: {
          include: {
            semester: true,
          },
        },
      },
      orderBy: [
        { course: { semesterId: 'asc' } },
        { courseId: 'asc' },
        { score: 'desc' },
      ],
    });

    const seenCourses = new Set();
    const filtered = grades.filter((g) => {
      if (!seenCourses.has(g.courseId)) {
        seenCourses.add(g.courseId);
        return true;
      }
      return false;
    });

    const grouped = filtered.reduce((acc, grade) => {
      const semesterName = grade.course.semester?.name || 'Unspecified';
      if (!acc[semesterName]) acc[semesterName] = [];

      acc[semesterName].push({
        courseId: grade.courseId,
        courseName: grade.course.name,
        highestGrade: grade.score,
      });

      return acc;
    }, {});

    res.status(200).json(grouped);
  } catch (err) {
    console.error('Failed to fetch passed courses:', err);
    res.status(500).json({ error: 'Failed to fetch passed courses' });
  }
}


/**
 * Get course by ID.
 * @route GET /api/courses/:id
 * @param {string} req.params.id - Course ID
 * @returns 200 - Course object
 * @returns 404 - Not found
 */
async function getCourseById(req, res) {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: { semester: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch course' });
  }
}

/**
 * Search courses by name.
 * @route GET /api/courses/search
 * @query query - Partial course name
 * @returns 200 - List of course matches
 * @returns 500 - Server error
 */
async function searchCourses(req, res) {
  const { query } = req.query;

  if (!query || query.trim().length < 1) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const results = await prisma.course.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
    });

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Failed to search courses:', err);
    return res.status(500).json({ error: 'Failed to search courses' });
  }
}

/**
 * Update a course by ID.
 * @route PUT /api/courses/:id
 * @param {string} req.params.id - Course ID
 * @param {string} req.body.name - New course name
 * @returns 200 - Updated course
 * @returns 400 - Missing name
 * @returns 404 - Not found
 */
async function updateCourse(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'New name is required' });
  }

  try {
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    return res.status(200).json(course);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(500).json({ error: 'Failed to update course' });
  }
}

/**
 * Delete a course by ID.
 * @route DELETE /api/courses/:id
 * @param {string} req.params.id - Course ID
 * @returns 204 - Deleted
 * @returns 404 - Not found
 */
async function deleteCourse(req, res) {
  const { id } = req.params;

  try {
    await prisma.course.delete({ where: { id: parseInt(id) } });
    return res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(500).json({ error: 'Failed to delete course' });
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  getPassedCoursesGroupedBySemester,
  getCourseById,
  updateCourse,
  searchCourses,
  deleteCourse,
};
