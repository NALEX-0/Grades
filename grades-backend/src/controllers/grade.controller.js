const prisma = require('../prisma/client');

/**
 * Create a grade for the authenticated user.
 * @route POST /api/grades
 * @param {number} req.body.courseId - ID of the course
 * @param {number} req.body.examinationId - ID of the examination
 * @param {number} req.body.score - Grade score (integer)
 * @returns 201 - Created grade
 * @returns 400 - Missing or invalid data
 * @returns 404 - Course or exam not found
 * @returns 500 - Server error
 */
async function createGrade(req, res) {
  const { courseId, examinationId, score } = req.body;
  const userId = req.user?.id;

  if (!courseId || !examinationId || typeof score !== 'number') {
    return res.status(400).json({ error: 'courseId, examinationId, and numeric score are required' });
  }

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const exam = await prisma.examination.findUnique({ where: { id: examinationId } });

    if (!course || !exam) {
      return res.status(404).json({ error: 'Course or examination not found' });
    }

    const grade = await prisma.grade.create({
      data: {
        score,
        userId,
        courseId,
        examinationId,
      },
    });

    return res.status(201).json({ grade });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create grade' });
  }
}

/**
 * Get paginated grades for the logged-in user.
 * @route GET /api/grades?page=1&limit=10
 * @returns 200 - Paginated list of grades
 * @returns 500 - Server error
 */
async function getUserGrades(req, res) {
  const userId = req.user?.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [grades, total] = await Promise.all([
      prisma.grade.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              semester: true,
            },
          },
          examination: true,
        },
        orderBy: {
          id: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.grade.count({
        where: { userId },
      }),
    ]);

    return res.status(200).json({
      data: grades,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch grades' });
  }
}


/**
 * Update a grade's score or examination.
 * @route PUT /api/grades/:id
 * @param {number} req.params.id - Grade ID
 * @returns 200 - Updated grade
 * @returns 400 - Missing data
 * @returns 404 - Grade not found
 * @returns 403 - Not owner
 * @returns 500 - Server error
 */
async function updateGrade(req, res) {
  const { id } = req.params;
  const { score, examinationId } = req.body;
  const userId = req.user?.id;

  if (typeof score !== 'number' && !examinationId) {
    return res.status(400).json({ error: 'Must provide score or examinationId' });
  }

  try {
    const grade = await prisma.grade.findUnique({ where: { id: parseInt(id) } });

    if (!grade) return res.status(404).json({ error: 'Grade not found' });
    if (grade.userId !== userId) return res.status(403).json({ error: 'Not authorized to update this grade' });

    const updated = await prisma.grade.update({
      where: { id: grade.id },
      data: {
        ...(typeof score === 'number' && { score }),
        ...(examinationId && { examinationId }),
      },
    });

    return res.status(200).json({ grade: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update grade' });
  }
}

/**
 * Delete a grade.
 * @route DELETE /api/grades/:id
 * @param {number} req.params.id - Grade ID
 * @returns 204 - Deleted
 * @returns 403 - Not owner
 * @returns 404 - Not found
 * @returns 500 - Server error
 */
async function deleteGrade(req, res) {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const grade = await prisma.grade.findUnique({ where: { id: parseInt(id) } });

    if (!grade) return res.status(404).json({ error: 'Grade not found' });
    if (grade.userId !== userId) return res.status(403).json({ error: 'Not authorized to delete this grade' });

    await prisma.grade.delete({ where: { id: grade.id } });

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete grade' });
  }
}

module.exports = {
  createGrade,
  getUserGrades,
  updateGrade,
  deleteGrade,
};
