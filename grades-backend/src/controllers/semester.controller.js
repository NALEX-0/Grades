const prisma = require('../prisma/client');

/**
 * Create a new semester.
 * @route POST /api/semesters
 * @param {string} req.body.name - Semester name
 * @returns 201 - Created semester
 * @returns 400 - Duplicate or missing name
 * @returns 500 - Server error
 */
async function createSemester(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Semester name is required' });
  }

  try {
    const existing = await prisma.semester.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Semester with this name already exists' });
    }

    const semester = await prisma.semester.create({ data: { name } });
    return res.status(201).json({ semester });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create semester' });
  }
}

/**
 * Get all semesters.
 * @route GET /api/semesters
 * @returns 200 - List of semesters
 * @returns 500 - Server error
 */
async function getAllSemesters(req, res) {
  try {
    const semesters = await prisma.semester.findMany();
    return res.status(200).json(semesters);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch semesters' });
  }
}

/**
 * Get a semester by name.
 * @route GET /api/semesters/:name
 * @param {string} req.params.id - Semester ID
 * @returns 200 - Semester object
 * @returns 404 - Not found
 */
async function getSemesterByName(req, res) {
  const { name } = req.query;
  try {
    const semester = await prisma.semester.findUnique({
      where: { name: name },
    });

    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }

    return res.status(200).json(semester);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch semester' });
  }
}

/**
 * Search semesters by name.
 * @route GET /api/semesters/search
 * @query query - Partial semester name
 * @returns 200 - List of semester matches
 * @returns 400 - If query is missing
 * @returns 500 - Server error
 */
async function searchSemesters(req, res) {
  const { query } = req.query;

  if (!query || query.trim().length < 1) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const results = await prisma.semester.findMany({
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
    console.error('Failed to search semesters:', err);
    return res.status(500).json({ error: 'Failed to search semesters' });
  }
}

/**
 * Update a semester by ID.
 * @route PUT /api/semesters/:id
 * @param {string} req.params.id - Semester ID
 * @param {string} req.body.name - New name
 * @returns 200 - Updated semester
 * @returns 404 - Not found
 */
async function updateSemester(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const semester = await prisma.semester.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    return res.status(200).json(semester);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Semester not found' });
    }
    return res.status(500).json({ error: 'Failed to update semester' });
  }
}

/**
 * Delete a semester by ID.
 * @route DELETE /api/semesters/:id
 * @param {string} req.params.id - Semester ID
 * @returns 204 - Deleted successfully
 * @returns 404 - Not found
 */
async function deleteSemester(req, res) {
  const { id } = req.params;

  try {
    await prisma.semester.delete({ where: { id: parseInt(id) } });
    return res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Semester not found' });
    }
    return res.status(500).json({ error: 'Failed to delete semester' });
  }
}

module.exports = {
  createSemester,
  getAllSemesters,
  getSemesterByName,
  searchSemesters,
  updateSemester,
  deleteSemester,
};
